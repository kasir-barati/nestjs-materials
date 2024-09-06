import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { AbstractDocument } from './abstract.schema';
import { DuplicationError, MongoError } from './database.type';

const mockedFind = jest.fn();
const mockedCreate = jest.fn();
const mockedFindById = jest.fn();
const mockedDeleteOne = jest.fn();
const mockedUpdateMany = jest.fn();
const mockedCountDocuments = jest.fn();
const mockedFindByIdAndUpdate = jest.fn();
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');

  return {
    ...actualMongoose,
    Model: jest.fn().mockImplementation(() => {
      return {
        find: mockedFind,
        create: mockedCreate,
        findById: mockedFindById,
        deleteOne: mockedDeleteOne,
        updateMany: mockedUpdateMany,
        countDocuments: mockedCountDocuments,
        findByIdAndUpdate: mockedFindByIdAndUpdate,
      };
    }),
  };
});

interface TestDoc extends AbstractDocument {
  testField: string;
}

describe('AbstractRepository', () => {
  let repository: AbstractRepository<TestDoc>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    repository = new AbstractRepository(new Model<TestDoc>());
  });

  // #region Create
  it.each<Parameters<AbstractRepository<TestDoc>['create']>['0']>([
    { testField: 'test' },
    { testField: 'somethign' },
  ])('should create a document and return it', async (data) => {
    mockedCreate.mockResolvedValue({
      toObject: () => ({
        _id: 'object id',
        ...data,
      }),
    });

    const document = await repository.create(data);

    expect(document).toStrictEqual({
      _id: expect.any(String),
      ...data,
    });
  });

  it('should thrown a duplication error on creating a new document', async () => {
    const error = new MongoError();
    error.keyValue = { email: 'IDK' };
    error.code = 11000;
    mockedCreate.mockRejectedValue(error);

    const document = repository.create({
      testField: 'some random value',
    });

    await expect(document).rejects.toThrowError(
      new DuplicationError('email', 'email already exists.'),
    );
  });

  it('should propagate thrown error by create method', async () => {
    mockedCreate.mockRejectedValue(new Error('some error'));

    const document = repository.create({
      testField: 'some random value',
    });

    await expect(document).rejects.toThrowError('some error');
  });
  // #endregion

  // #region Read
  it('should read all the documents', async () => {
    const mockedToObject = jest
      .fn()
      .mockReturnValue({ testField: 'field' });
    const mockedLimit = jest
      .fn()
      .mockReturnValue([{ toObject: mockedToObject }]);
    const mockedSkip = jest
      .fn()
      .mockImplementation(() => ({ limit: mockedLimit }));
    mockedFind.mockImplementation(() => ({
      skip: mockedSkip,
    }));
    mockedCountDocuments.mockResolvedValue(10);

    const result = await repository.read(
      { testField: 'something' },
      { page: 1, limit: 10 },
    );

    expect(mockedSkip).toHaveBeenCalledWith(1);
    expect(mockedLimit).toHaveBeenCalledWith(10);
    expect(result).toStrictEqual({
      data: result.data,
      page: 1,
      limit: 10,
      total: 10,
      prev: null,
      next: null,
      lastPage: 1,
    });
  });

  it('should propagate any error thrown by read', async () => {
    mockedFind.mockImplementation(() => {
      throw new Error('random');
    });

    const result = repository.read({}, { page: 1, limit: 1 });

    await expect(result).rejects.toThrowError('random');
  });

  it.each<string>(['object id 1', 'object id 2'])(
    'should find by id and return the document',
    async (id) => {
      mockedFindById.mockResolvedValue({
        toObject: () => ({
          testField: 'data',
          _id: id,
        }),
      });

      const document = await repository.findById(id);

      expect(mockedFindById).toHaveBeenCalledWith(id);
      expect(document).toStrictEqual({
        _id: id,
        testField: 'data',
      });
    },
  );

  it('should throw not found when could find document for findById', async () => {
    mockedFindById.mockResolvedValue(undefined);

    const document = repository.findById('not existing id');

    expect(mockedFindById).toHaveBeenCalledWith('not existing id');
    await expect(document).rejects.toThrowError(
      new NotFoundException('NotFound'),
    );
  });

  it('should propagate thrown error by findById', async () => {
    mockedFindById.mockRejectedValue(new Error('boom'));

    const document = repository.findById('object id');

    await expect(document).rejects.toThrowError('boom');
  });
  // #endregion

  // #region Update
  it('should update document with the passed id', async () => {
    const id = 'object id';
    const testField = 'new value';
    mockedFindByIdAndUpdate.mockResolvedValue({
      toObject: () => ({ _id: id, testField }),
    });

    const updatedDocument = await repository.update(id, {
      testField,
    });

    expect(mockedFindByIdAndUpdate).toHaveBeenCalledWith(
      { _id: id },
      { testField },
      { new: true, upsert: false },
    );
    expect(updatedDocument).toStrictEqual({
      _id: id,
      testField,
    });
  });

  it('should throw not found error on updating with non-existing id', async () => {
    mockedFindByIdAndUpdate.mockResolvedValue(undefined);

    const result = repository.update('object id', {
      testField: 'new val',
    });

    await expect(result).rejects.toThrowError(
      new NotFoundException(),
    );
  });

  it('should propagates error occurred on update with id', async () => {
    mockedFindByIdAndUpdate.mockRejectedValue(new Error());

    const result = repository.update('object id', {
      testField: 'new val',
    });

    await expect(result).rejects.toThrowError(new Error());
  });

  it('should update many and return the updated docs', async () => {
    mockedUpdateMany.mockResolvedValue({ modifiedCount: 2 });
    mockedFind.mockResolvedValue([
      {
        toObject: () => ({ _id: 'objectId1', testField: 'new val' }),
      },
      {
        toObject: () => ({ _id: 'objectId2', testField: 'new val' }),
      },
    ]);
    const filterQuery = {
      _id: { $in: ['objectId1', 'objectId2'] },
    };
    const updateQuery = { testField: 'new val' };

    const updatedDocuments = await repository.updateMany(
      filterQuery,
      updateQuery,
    );

    expect(mockedUpdateMany).toHaveBeenCalledWith(
      filterQuery,
      updateQuery,
      { upsert: false },
    );
    expect(updatedDocuments).toStrictEqual([
      { _id: 'objectId1', testField: 'new val' },
      { _id: 'objectId2', testField: 'new val' },
    ]);
  });

  it('should return undefined when update many matches nothing', async () => {
    mockedUpdateMany.mockResolvedValue({ modifiedCount: 0 });

    const result = await repository.updateMany(
      { testField: 'some value' },
      { testField: 'new val' },
    );

    expect(result).toBeUndefined();
  });

  it('should propagate errors occurred on update many', async () => {
    mockedUpdateMany.mockRejectedValue(new Error());

    const result = repository.updateMany(
      { testField: 'some value' },
      { testField: 'new val' },
    );

    await expect(result).rejects.toThrowError(new Error());
  });
  // #endregion

  // #region Delete
  it('should delete document with the passed id', async () => {
    mockedDeleteOne.mockResolvedValue({ deletedCount: 1 });

    const result = await repository.delete('OBJECT ID');

    expect(mockedDeleteOne).toHaveBeenCalledWith({
      _id: 'OBJECT ID',
    });
    expect(result).toBeTruthy();
  });

  it('should throw not found exception on deleting non-existing id', async () => {
    mockedDeleteOne.mockResolvedValue({ deletedCount: 0 });

    const result = await repository.delete('non-existing OBJECT ID');

    expect(result).toBeFalsy();
  });

  it('should propagate exceptions occurred in delete method', async () => {
    mockedDeleteOne.mockRejectedValue(new Error());

    const result = repository.delete('some object id');

    await expect(result).rejects.toThrowError(new Error());
  });
  // #endregion
});
