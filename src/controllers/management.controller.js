const db = require("../configs/database");

const getQuickGuessQuickWinList = async (ctx) => {
  try {
    const { offset, limit } = ctx.request.query;
    let _offset = 0,
      _limit = 10;
    if (offset) {
      _offset = offset;
    }
    if (limit) {
      _limit = limit;
    }
    const [rows] = await db.execute(
      `SELECT * FROM quick_guess_quick_win_answers ORDER BY createdAt DESC, id DESC LIMIT ? OFFSET ?`,
      [_limit, _offset]
    );
    const [[total]] = await db.execute(
      "SELECT COUNT(*) as total FROM quick_guess_quick_win_answers"
    );
    ctx.body = {
      total: total.total,
      data: rows,
    };
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

const createQuickGuessQuickWinList = async (ctx) => {
  try {
    const dataBody = ctx.request.body;
    let query = dataBody.map((dataItem) => `('${dataItem}')`);
    query = query.join(", ");
    await db.execute(
      `INSERT INTO quick_guess_quick_win_answers (content) VALUES ${query}`
    );
    ctx.body = { message: "success" };
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

const deleteQuickGuessQuickWinList = async (ctx) => {
  try {
    const { id } = ctx.request.body;
    await db.execute(`DELETE FROM quick_guess_quick_win_answers WHERE id = ?`, [
      id,
    ]);
    ctx.body = { message: "success" };
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

module.exports = {
  getQuickGuessQuickWinList,
  createQuickGuessQuickWinList,
  deleteQuickGuessQuickWinList
};
