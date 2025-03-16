const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Coach",
  tableName: "COACH",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
      nullable: false,
    },
    user_id: {
      type: "uuid",
      nullable: false,
      unique: true,
    },
    experience_years: {
      type: "integer",
      nullable: false,
    },
    description: {
      type: "text",
      nullable: false,
    },
    profile_image_url: {
      type: "varchar",
      nullable: true,
      length: 2048,
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
  // 建立關聯
  relations: {
    User: {
      target: "User",
      type: "one-to-one",
      inverseSide: "Coach",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id", //對應到哪一張table
        foreignKeyConstraintName: "coach_user_id_fk", //可以自己取名字
      },
    },
  },
});
