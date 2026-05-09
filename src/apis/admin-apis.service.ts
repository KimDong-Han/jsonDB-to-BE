import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import Redis from 'ioredis';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { newbwg, newbwgType } from './entities/newbwg.entity';
import { CreateNewbwgDto } from './dto/create-newbwg.dto';
import { UpdateNewbwgDto } from './dto/update-newbwg.dto';
import { PreviewUrlDto } from './dto/preview-url.dto';

const REDIS_FIRST_PAGE_KEY = 'newbwg:first';
const YT_REGEX =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;

@Injectable()
export class AdminApisService {
  private readonly logger = new Logger(AdminApisService.name);

  constructor(
    @InjectRepository(newbwg)
    private readonly newbwgRepo: Repository<newbwg>,
    @Inject('REDIS') private readonly redisClient: Redis,
  ) {}

  async previewYoutube(dto: PreviewUrlDto) {
    const match = dto.url.match(YT_REGEX);
    if (!match) {
      throw new ConflictException('올바르지 않은 YouTube URL 형식입니다.');
    }
    const videoId = match[1];
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.API_KEY_YTB}`;
    try {
      const { data } = await axios.get(url);
      if (!data.items?.length) {
        throw new NotFoundException('동영상을 찾을 수 없습니다.');
      }
      const snippet = data.items[0].snippet;
      const thumbs = snippet.thumbnails ?? {};
      const iconImg =
        thumbs.maxres?.url ||
        thumbs.standard?.url ||
        thumbs.high?.url ||
        thumbs.medium?.url ||
        thumbs.default?.url ||
        '';
      return {
        videoId,
        url: `https://youtu.be/${videoId}`,
        title: snippet.title,
        iconImg,
        uploadDate: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        channelUrl: snippet.channelId
          ? `https://www.youtube.com/channel/${snippet.channelId}`
          : '',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (axios.isAxiosError(error)) {
        throw new InternalServerErrorException('YouTube API 호출 오류');
      }
      throw error;
    }
  }

  async listNewbwg(query: PaginateQuery) {
    const sortableColumns: newbwgType[] = [
      'uploadDate',
      'createdAt',
      'updatedAt',
    ];
    const defaultSortBy: [newbwgType, 'ASC' | 'DESC'][] = [
      ['createdAt', 'DESC'],
    ];
    const searchableColumns: newbwgType[] = ['title', 'tag'];
    return paginate(query, this.newbwgRepo, {
      sortableColumns,
      defaultSortBy,
      searchableColumns,
      filterableColumns: {
        tag: [FilterOperator.EQ],
      },
    });
  }

  async getNewbwg(id: string) {
    const item = await this.newbwgRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    return item;
  }

  async createNewbwg(dto: CreateNewbwgDto) {
    const exists = await this.newbwgRepo.findOne({ where: { url: dto.url } });
    if (exists) {
      throw new ConflictException('이미 존재하는 URL입니다.');
    }
    const created = this.newbwgRepo.create({
      title: dto.title,
      url: dto.url,
      iconImg: dto.iconImg,
      tag: dto.tag ?? 'none',
      uploadDate: new Date(dto.uploadDate),
    });
    const saved = await this.newbwgRepo.save(created);
    await this.invalidateFirstPageCache();
    return saved;
  }

  async updateNewbwg(id: string, dto: UpdateNewbwgDto) {
    const target = await this.newbwgRepo.findOne({ where: { id } });
    if (!target) throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    if (dto.url && dto.url !== target.url) {
      const dup = await this.newbwgRepo.findOne({ where: { url: dto.url } });
      if (dup) throw new ConflictException('이미 존재하는 URL입니다.');
    }
    if (dto.title !== undefined) target.title = dto.title;
    if (dto.url !== undefined) target.url = dto.url;
    if (dto.iconImg !== undefined) target.iconImg = dto.iconImg;
    if (dto.tag !== undefined) target.tag = dto.tag;
    if (dto.uploadDate !== undefined) {
      target.uploadDate = new Date(dto.uploadDate);
    }
    const saved = await this.newbwgRepo.save(target);
    await this.invalidateFirstPageCache();
    return saved;
  }

  async deleteNewbwg(id: string) {
    const result = await this.newbwgRepo.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    }
    await this.invalidateFirstPageCache();
    return { deleted: true };
  }

  private async invalidateFirstPageCache() {
    try {
      await this.redisClient.del(REDIS_FIRST_PAGE_KEY);
    } catch (e) {
      this.logger.warn(`Redis 캐시 무효화 실패: ${e}`);
    }
  }
}
