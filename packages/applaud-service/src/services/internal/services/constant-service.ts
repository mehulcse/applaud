import * as yup from "yup";
import {QueryInitializationResult} from "../common";
import {
  ensureAdmin,
  ensureUser,
} from "../../auth/helpers";
import {AppContext} from "../../auth/app-context";
import Constant from "../db/models/constant";

export interface UpdateConstantInput {
  name?: string;
  value?: string;
}

export class ConstantService {
  readonly context: AppContext;

  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Constant> {
    const viewer = ensureUser(this.context.viewer);

    const query = Constant.query();

    if (viewer.isAdmin) {
      // No restrictions
    } else {
      throw new Error("Unauthorized access.");
    }

    return {
      query
    };
  }

  async update(constantId: number, updates: UpdateConstantInput) {
    ensureAdmin(this.context.viewer);
    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Name")
        .min(1)
        .max(255)
        .notRequired()
        .nullable(false),
      value: yup
        .string()
        .label("Value")
        .min(1)
        .max(255)
        .required()
        .nullable(false)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateConstantInput;

    const constant = await Constant.query().updateAndFetchById(
      constantId,
      validatedUpdates
    );

    return constant;
  }
}
