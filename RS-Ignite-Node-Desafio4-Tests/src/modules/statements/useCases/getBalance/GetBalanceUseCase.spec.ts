/* import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";

interface IRequest {
  user_id: string;
}

interface IResponse {
  statement: Statement[];
  balance: number;
}

@injectable()
export class GetBalanceUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ user_id }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new GetBalanceError();
    }

    const balance = await this.statementsRepository.getUserBalance({
      user_id,
      with_statement: true
    });

    return balance as IResponse;
  }
}
 */

// create test for the above use case

// Path: src\modules\statements\useCases\getBalance\GetBalanceUseCase.spec.ts
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test User",
      email: "email@test.com",
      password: "1234",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit test",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance).toHaveProperty("balance");
    expect(balance).toHaveProperty("statement");

    expect(balance.balance).toBe(100);
    expect(balance.statement.length).toBe(1);
  });

  it("should not be able to get balance with a non-existing user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "non-existing-user",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
