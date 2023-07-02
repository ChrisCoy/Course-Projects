import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "test@email.com",
      password: "1234",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with an existing email", async () => {
    expect(async () => {
      const user = {
        name: "John Doe",
        email: "test@email.com",
        password: "1234",
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute({ ...user, name: "John Doe 2" });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
