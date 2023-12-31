import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });
  it("should be able to show user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Test",
      email: "email@test.com",
      password: "1234",
    });

    const userProfile = await showUserProfileUseCase.execute(user.id!);

    expect(userProfile).toHaveProperty("id");
  });

  it("should not be able to show user profile if user does not exist", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("non-existing-user-id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
