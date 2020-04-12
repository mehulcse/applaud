import { GraphQLContext } from "../../../types/graphql-context";
import { FeedbackService } from "../../../services/internal/services/feedback-service";

interface CreateFeedbackInput {
  feedback: string;
}

interface Args {
  input: CreateFeedbackInput;
}

export default {
  Mutation: {
    createFeedback: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const feedback = await new FeedbackService(context).create(args.input);
      return {
        feedback
      };
    }
  }
};
