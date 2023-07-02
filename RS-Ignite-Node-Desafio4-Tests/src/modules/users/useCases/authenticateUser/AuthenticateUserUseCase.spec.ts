import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
  });

  it("should be able to authenticate an user", async () => {
    const user = {
      name: "User Test",
      email: "email@test.com",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    const authResponse = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authResponse).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    expect(async () =>
      authenticateUserUseCase.execute({
        email: "notauser@test.com",
        password: "1234",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate an user with incorrect password", async () => {
    expect(async () => {
      const user = {
        name: "User Test",
        email: "email@test.com",
        password: "1234",
      };

      await createUserUseCase.execute(user);

      const authResponse = await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrongpw",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
