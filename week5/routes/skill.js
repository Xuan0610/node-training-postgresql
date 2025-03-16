const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const {
  isNotValidSting,
  isNotValidInteger,
  isUndefined,
} = require("../utils/validUtils");
const logger = require("../utils/logger")("Skill");

router.get("/", async (req, res, next) => {
  try {
    const skills = await dataSource.getRepository("Skill").find({
      select: ["id", "name"],
    });
    res.status(200).json({
      status: "success",
      data: skills,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    if (isUndefined(data.name) || isNotValidSting(data.name)) {
      res.status(400).json({
        "status": "failed",
        "message": "欄位未填寫正確",
      });
      return;
    }
    const SkillRepo = await dataSource.getRepository("Skill");
    const findSkill = await SkillRepo.find({
      where: {
        name: data.name,
      },
    });
    if (findSkill.length > 0) {
      res.status(409).json({
        "status": "failed",
        "message": "資料重複",
      });
      return;
    }
    const newSkill = await SkillRepo.create({
      name: data.name,
    });
    const result = await SkillRepo.save(newSkill);
    res.status(200).json({
      "status": "success",
      "data": result,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.delete("/:skillId", async (req, res, next) => {
  try {
    {
      const skillId = req.params;
      if (isUndefined(skillId) || isNotValidSting(skillId)) {
        res.status(400).json({
          "status": "failed",
          "message": "ID錯誤",
        });
        return;
      }
      const result = await dataSource.getRepository("SKILL").delete(skillId);
      if (result.affected === 0) {
        res.status(400).json({
          "status": "failed",
          "message": "ID錯誤",
        });
        return;
      }
      res.status(200).json({
        "status": "success",
      });
    }
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

module.exports = router;
