import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import {
  DuplicationError,
  MongoError,
  Pagination,
} from './database.type';

export class AbstractRepository<Document extends AbstractDocument> {
  // Do the same thing in the extended classes
  protected readonly logger: Logger = new Logger(
    AbstractRepository.name,
  );

  constructor(protected readonly model: Model<Document>) {}

  // #region Create
  async create(
    data: Omit<Document, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Document> {
    const createdDocument = await this.model
      .create(data)
      .catch((error: MongoError) => {
        if (error.code === 11000) {
          const field = Object.keys(error.keyValue)[0];

          throw new DuplicationError(
            field,
            field + ' already exists.',
          );
        }
        throw error;
      });

    return createdDocument.toObject();
  }
  // #endregion

  // #region Read
  async read(
    filterQuery: FilterQuery<Document>,
    { page, limit }: { page: number; limit: number },
  ): Promise<Pagination<Document>> {
    const documents = await this.model
      .find(filterQuery)
      .skip(page)
      .limit(limit);
    const data = documents.map((doc) => doc.toObject());
    const total = await this.model.countDocuments(filterQuery);
    const lastPage = Math.ceil(total / limit);
    const next = page + 1 >= lastPage ? null : page + 1;
    const prev = page - 1 <= 0 ? null : page - 1;

    return {
      page,
      prev,
      next,
      limit,
      total,
      lastPage,
      data,
    };
  }

  async findById(id: string): Promise<Document> {
    const document = await this.model.findById(id).exec();

    if (!document) {
      this.logger.warn({
        id,
        message: 'Could not find the document with the given id.',
      });
      throw new NotFoundException('NotFound');
    }

    return document.toObject();
  }
  // #endregion

  // #region Update
  async update(id: string, updateQuery: UpdateQuery<Document>) {
    const updatedDocument = await this.model.findByIdAndUpdate(
      { _id: id },
      updateQuery,
      { upsert: false, new: true },
    );

    if (!updatedDocument) {
      this.logger.warn({
        id,
        message: 'Could not find the document with the given id.',
      });
      throw new NotFoundException();
    }

    return updatedDocument.toObject();
  }
  async updateMany(
    filterQuery: FilterQuery<Document>,
    updateQuery: UpdateQuery<Document>,
  ): Promise<undefined | Document[]> {
    const result = await this.model.updateMany(
      filterQuery,
      updateQuery,
      { upsert: false },
    );

    if (result.modifiedCount > 0) {
      const documents = await this.model.find(filterQuery);

      return documents.map((doc) => doc.toObject());
    }
  }
  // #endregion

  // #region Delete
  async delete(id: string) {
    const result = await this.model.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      this.logger.warn({
        id,
        message: 'Could not find the document with the given id.',
      });
      throw new NotFoundException();
    }
  }
  // #endregion
}
