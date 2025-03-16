const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "USER",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
      nullable: false, //不可為空
    },
    name: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 320,
      nullable: false,
      unique: true, //不可重複
    },
    role: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    password: {
      type: "varchar",
      length: 72,
      nullable: false,
      select: false, //使用到find就不會被撈出來
    },
    created_at: {
      type: "timestamp",
      nullable: false,
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      nullable: false,
      updateDate: true,
    },
  },
});
