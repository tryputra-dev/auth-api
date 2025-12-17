const NewComment = require("../../Domains/comments/entities/NewComment");

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, content, owner } = useCasePayload;

    await this._threadRepository.checkThreadExistence(threadId);
    const newComment = new NewComment(useCasePayload);
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
