import { describe, expect, it } from "@jest/globals";
import { plainToInstance } from "class-transformer";
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  validate,
} from "class-validator";
import { OneOf } from "./one-of.decorator";

@OneOf(["email", "phone"])
class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNumber()
  phone: number;

  @IsOptional()
  @IsString()
  name?: string;
}

describe("OneOf", () => {
  it.each<Record<string, string | number>>([
    { phone: 123456789 },
    { email: "some@mail.jp" },
  ])(
    "should not throw an error when only email/phone is present",
    async (plain) => {
      const user = plainToInstance(CreateUserDto, plain);

      const errors = await validate(user);

      expect(errors).toHaveLength(0);
    }
  );

  it.each<Record<string, unknown>>([
    { email: 123 },
    { email: "some junk mail" },
  ])("should validate email", async (plain) => {
    const user = plainToInstance(CreateUserDto, plain);

    const errors = await validate(user);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toStrictEqual({
      isEmail: "email must be an email",
    });
  });

  it.each<Record<string, unknown>>([
    { phone: false },
    { phone: "junk phone number" },
  ])("should validate phone", async (plain) => {
    const user = plainToInstance(CreateUserDto, plain);

    const errors = await validate(user);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toStrictEqual({
      isNumber:
        "phone must be a number conforming to the specified constraints",
    });
  });

  it("should not throw an error when both phone and email is present", async () => {
    const plain = { email: "gg@pp.cc", phone: 1122334455 };
    const user = plainToInstance(CreateUserDto, plain);

    const errors = await validate(user);

    expect(errors).toHaveLength(2);
    expect(errors).toContainEqual({
      children: [],
      constraints: {
        OneOfChecker: "Do not send email, and phone at the same time!",
      },
      property: "email",
      target: { email: "gg@pp.cc", phone: 1122334455 },
      value: "gg@pp.cc",
    });
  });
});
