import { Injectable } from '@nestjs/common';
import { CreateNovelDto } from './dto/create-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';

@Injectable()
export class NovelsService {
  create(createNovelDto: CreateNovelDto) {
    return 'This action adds a new novel';
  }

  findAll() {
    return `This action returns all novels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} novel`;
  }

  update(id: number, updateNovelDto: UpdateNovelDto) {
    return `This action updates a #${id} novel`;
  }

  remove(id: number) {
    return `This action removes a #${id} novel`;
  }
}
