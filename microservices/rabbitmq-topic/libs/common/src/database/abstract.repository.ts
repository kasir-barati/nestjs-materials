import { Logger, NotFoundException } from '@nestjs/common';
import {
  ClientSession,
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import {
  DuplicationError,
  MongoError,
  Pagination,
  PartialId,
} from './database.type';

export class AbstractRepository<Document extends AbstractDocument> {
  // Do the same thing in the extended classes
  protected readonly logger: Logger = new Logger(
    AbstractRepository.name,
  );

  constructor(protected readonly model: Model<Document>) {}

  startSession(): Promise<ClientSession> {
    return this.model.startSession();
  }

  // #region Create
  async create(
    data: Omit<Document, '_id' | 'createdAt' | 'updatedAt'> &
      PartialId,
    session?: ClientSession,
  ): Promise<Document> {
    const createdDocument = await this.model
      .insertMany([data], { session })
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

    return createdDocument[0].toObject();
  }
  // #endregion

  // #region Read
  async read(
    filterQuery: FilterQuery<Document>,
    { page, limit }: { page: number; limit: number },
    session?: ClientSession,
  ): Promise<Pagination<Document>> {
    const documents = await this.model
      .find(filterQuery)
      .skip(page - 1)
      .limit(limit)
      .session(session);
    const data = documents.map((doc) => doc.toObject());
    const total = await this.model.countDocuments(filterQuery, {
      session,
    });
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

  async findById(
    id: string,
    queryOptions?: QueryOptions<Document>,
  ): Promise<Document> {
    const document = await this.model
      .findById(id, null, queryOptions)
      .exec();

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
  async update(
    id: string,
    updateQuery: UpdateQuery<Document>,
    session?: ClientSession,
  ) {
    const updatedDocument = await this.model.findByIdAndUpdate(
      { _id: id },
      updateQuery,
      { upsert: false, new: true, session },
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
    session?: ClientSession,
  ): Promise<undefined | Document[]> {
    const result = await this.model.updateMany(
      filterQuery,
      updateQuery,
      { upsert: false, session },
    );

    if (result.modifiedCount > 0) {
      const documents = await this.model.find(filterQuery);

      return documents.map((doc) => doc.toObject());
    }
  }
  // #endregion

  // #region Delete
  async delete(id: string, session?: ClientSession) {
    const result = await this.model.deleteOne(
      { _id: id },
      session ? { session } : undefined,
    );

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
