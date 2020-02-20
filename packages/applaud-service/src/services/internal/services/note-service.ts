import moment from "moment";
import * as yup from "yup";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { CustomerService } from "./customer-service";
import { ensureUser } from "../../auth/helpers";
import Note from "../db/models/note";
import { NOTE_ENTITIES } from "../../../constants";
import { UnauthorizedAccessError } from "../../../errors";
import { AppContext } from "../../auth/app-context";

export interface NotesOptions extends PaginationArgs {
  entity: string;
  entityId?: string;
}

export interface CreateNoteInput {
  entity: string;
  entityId: string;
  content: string;
}

export interface UpdateNoteInput {
  content: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class NoteService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(entity: string): QueryInitializationResult<Note> {
    const viewer = ensureUser(this.context.viewer);

    const query = Note.query();

    if (entity === NOTE_ENTITIES.CUSTOMER) {
      query.where({ entity: NOTE_ENTITIES.CUSTOMER });
      if (viewer.isAdmin) {
        // No restrictions
      } else if (viewer.partnerUsers.length > 0 && viewer.partnerUser) {
        if (viewer.partnerUser.isAdmin) {
          query.whereIn(
            "entityId",
            new CustomerService(this.context).getAllQuery({}).select("id")
          );
        } else {
          query.whereIn(
            "entityId",
            new CustomerService(this.context)
              .getAllQuery({
                accountManagerUserId: viewer.userId
              })
              .select("id")
          );
        }
      } else {
        throw new UnauthorizedAccessError();
      }
    } else {
      throw new UnauthorizedAccessError();
    }

    return {
      query
    };
  }

  async getById(id: number) {
    const note = await Note.query().findById(id);
    if (!note) {
      return null;
    }
    switch (note.entity) {
      case NOTE_ENTITIES.CUSTOMER:
        await new CustomerService(this.context).getById(
          parseInt(note.entityId, 10)
        );
        break;
      default:
        return null;
    }
    return note;
  }

  private getAllQuery(options: NotesOptions) {
    const { query } = this.initializeAuthorizedQuery(options.entity);

    handlePagination(query, options);

    if (options.entityId) {
      query.where({ entityId: options.entityId });
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Note.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Note.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${Note.tableName}.id`, "desc");
        break;
    }

    return query;
  }

  async getFirst(options: NotesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: NotesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: NotesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateNoteInput) {
    const viewer = ensureUser(this.context.viewer);

    switch (input.entity) {
      case NOTE_ENTITIES.CUSTOMER:
        await new CustomerService(this.context).getById(
          parseInt(input.entityId, 10)
        );
        break;
      default:
        throw new Error(`Unknown entity type specified: ${input.entity}`);
    }

    // Validation
    const schema = yup.object().shape({
      content: yup
        .string()
        .label("Content")
        .min(1)
        .required()
        .nullable(false),
      entity: yup
        .string()
        .label("Entity")
        .required()
        .nullable(false),
      entityId: yup
        .number()
        .label("Entity ID")
        .required()
        .nullable(false)
    });

    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateNoteInput;

    const note = await Note.query().insertAndFetch({
      content: validatedInput.content,
      entity: validatedInput.entity,
      entityId: validatedInput.entityId,
      userId: viewer.userId,
      createdAt: moment.utc().toDate()
    });

    // TODO: trigger note created event

    return note;
  }

  async update(noteId: number, updates: UpdateNoteInput) {
    const viewer = ensureUser(this.context.viewer);
    const originalNote = await this.getById(noteId);

    if (!originalNote) {
      throw new Error("Invalid Note ID specified.");
    }

    if (originalNote.userId !== viewer.userId) {
      throw new Error(
        "Notes can only be edited by the user that created them."
      );
    }

    switch (originalNote.entity) {
      case NOTE_ENTITIES.CUSTOMER:
        await new CustomerService(this.context).getById(
          parseInt(originalNote.entityId, 10)
        );
        break;
      default:
        throw new Error(
          `Unknown entity type specified: ${originalNote.entity}`
        );
    }

    // Validation
    const schema = yup.object().shape({
      content: yup
        .string()
        .label("Content")
        .min(1)
        .required()
        .nullable(false)
    });

    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateNoteInput;

    const note = await Note.query().patchAndFetchById(noteId, {
      ...validatedUpdates,
      lastUpdatedAt: moment.utc().toDate()
    });

    // TODO: trigger note updated event

    return note;
  }
}
