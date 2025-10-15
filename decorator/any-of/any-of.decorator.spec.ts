import { describe, it } from "@jest/globals";
import { plainToInstance, Type } from "class-transformer";
import { IsString, validate, ValidateNested } from "class-validator";
import { AnyOf } from "./any-of.decorator";

@AnyOf(["email", "phone"])
class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  phone: string;
}

class NestedExampleDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}

describe("AnyOf", () => {
  it.each([{ email: "email@em.cc" }, { phone: "0123456789" }])(
    "should pass when email or phone is provided",
    async (data) => {
      const user = plainToInstance(CreateUserDto, data);

      const errors = await validate(user);

      expect(errors).toHaveLength(0);
    }
  );

  it("should throw an error when nor email or phone is provided", async () => {
    const user = plainToInstance(CreateUserDto, {});

    const errors = await validate(user);

    expect(errors).toHaveLength(2);
    expect(errors).toEqual([
      {
        children: [],
        constraints: { isString: "email must be a string" },
        property: "email",
        target: {},
        value: undefined,
      },
      {
        children: [],
        constraints: { isString: "phone must be a string" },
        property: "phone",
        target: {},
        value: undefined,
      },
    ]);
  });

  it.each([
    { user: { email: "email@em.cc" } },
    { user: { phone: "0123456789" } },
  ])(
    "should pass when email or phone is provided in the nested object",
    async (data) => {
      const user = plainToInstance(NestedExampleDto, data);

      const errors = await validate(user);

      expect(errors).toHaveLength(0);
    }
  );

  it("should throw an error when nor email or phone is provided in the nested object", async () => {
    const user = plainToInstance(NestedExampleDto, { user: {} });

    const errors = await validate(user);

    expect(errors).toHaveLength(1);
    expect(errors[0].children).toEqual([
      {
        children: [],
        constraints: { isString: "email must be a string" },
        property: "email",
        target: expect.anything(),
        value: undefined,
      },
      {
        children: [],
        constraints: { isString: "phone must be a string" },
        property: "phone",
        target: expect.anything(),
        value: undefined,
      },
    ]);
  });
});
