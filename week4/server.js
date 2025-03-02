require("dotenv").config();
const http = require("http");
const AppDataSource = require("./db");

// 若為Undefined
function isUndefined(value) {
  return value === undefined;
}

// 若不是字串格式
function isNotValidSting(value) {
  return typeof value !== "string" || value.trim().length === 0 || value === "";
}

// 若不是數字格式
function isNotValidInteger(value) {
  return typeof value !== "number" || value < 0 || value % 1 !== 0;
}

const requestListener = async (req, res) => {
  // 設置header
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  // 取得購買方案 credit-package -> GET
  if (req.url === "/api/credit-package" && req.method === "GET") {
    try {
      const packages = await AppDataSource.getRepository("CreditPackage").find({
        select: ["id", "name", "credit_amount", "price"],
      });
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          data: packages,
        })
      );
      res.end();
    } catch (error) {
      res.writeHead(500, headers);
      res.write(
        JSON.stringify({
          status: "error",
          message: "伺服器錯誤",
        })
      );
      res.end();
    }
  }
  // 新增購買方案 credit-package -> POST
  else if (req.url === "/api/credit-package" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        if (
          isUndefined(data.name) ||
          isNotValidSting(data.name) ||
          isUndefined(data.credit_amount) ||
          isNotValidInteger(data.credit_amount) ||
          isUndefined(data.price) ||
          isNotValidInteger(data.price)
        ) {
          res.writeHead(400, headers);
          res.write(
            JSON.stringify({
              status: "failed",
              message: "欄位未填寫正確",
            })
          );
          res.end();
          return;
        }
        const creditPackageRepo = await AppDataSource.getRepository(
          "CreditPackage"
        );
        const existPackage = await creditPackageRepo.find({
          where: {
            name: data.name,
          },
        });
        if (existPackage.length > 0) {
          res.writeHead(409, headers);
          res.write(
            JSON.stringify({
              status: "failed",
              message: "資料重複",
            })
          );
          res.end();
          return;
        }
        const newPackage = await creditPackageRepo.create({
          name: data.name,
          credit_amount: data.credit_amount,
          price: data.price,
        });
        const result = await creditPackageRepo.save(newPackage);
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            data: result,
          })
        );
        res.end();
      } catch (error) {
        console.error(error);
        res.writeHead(500, headers);
        res.write(
          JSON.stringify({
            status: "error",
            message: "伺服器錯誤",
          })
        );
        res.end();
      }
    });
  }
  // 刪除購買方案 credit-package -> DELETE
  else if (
    req.url.startsWith("/api/credit-package/") &&
    req.method === "DELETE"
  ) {
    try {
      const packageId = req.url.split("/").pop();
      if (isUndefined(packageId) || isNotValidSting(packageId)) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "failed",
            message: "ID錯誤",
          })
        );
        res.end();
        return;
      }
      const result = await AppDataSource.getRepository("CreditPackage").delete(
        packageId
      );
      if (result.affected === 0) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "failed",
            message: "ID錯誤",
          })
        );
        res.end();
        return;
      }
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
        })
      );
      res.end();
    } catch (error) {
      console.error(error);
      res.writeHead(500, headers);
      res.write(
        JSON.stringify({
          status: "error",
          message: "伺服器錯誤",
        })
      );
      res.end();
    }
  }
  // 取得教練專長列表 skill -> GET
  else if (req.url === "/api/coaches/skill" && req.method === "GET") {
    try {
      const skills = await AppDataSource.getRepository("Skill").find({
        select: ["id", "name"],
      });
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          data: skills,
        })
      );
      res.end();
    } catch (error) {
      res.writeHead(500, headers);
      res.write(
        JSON.stringify({
          status: "error",
          message: "伺服器錯誤",
        })
      );
      res.end();
    }
  }
  // 新增教練專長 skill -> POST
  else if (req.url === "/api/coaches/skill" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        // 檢查欄位填寫正確性 400回傳
        if (isUndefined(data.name) || isNotValidSting(data.name)) {
          res.writeHead(400, headers);
          res.write(
            JSON.stringify({
              status: "failed",
              message: "欄位未填寫正確",
            })
          );
          res.end();
          return;
        }
        // 檢查資料是否有重復 409回傳
        const SkillRepo = await AppDataSource.getRepository("Skill");
        const findSkill = await SkillRepo.find({
          where: {
            name: data.name,
          },
        });
        if (findSkill.length > 0) {
          res.writeHead(409, headers);
          res.write(
            JSON.stringify({
              status: "failed",
              message: "資料重複",
            })
          );
          res.end();
          return;
        }
        const newSkill = await SkillRepo.create({
          name: data.name,
        });
        const result = await SkillRepo.save(newSkill);
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            data: result,
          })
        );
        res.end();
      } catch (error) {
        console.error(error);
        errorHandle(res);
      }
    });
  }
  // 刪除教練專長 skill -> DELETE
  else if (
    req.url.startsWith("/api/coaches/skill/") &&
    req.method === "DELETE"
  ) {
    try {
      const skillId = req.url.split("/").pop();
      // 字串檢查 -> 400回傳
      if (isUndefined(skillId) || isNotValidSting(skillId)) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "failed",
            message: "ID錯誤",
          })
        );
        res.end();
        return;
      }
      // 刪除時資料庫無此ID資料 -> 400回傳
      const result = await AppDataSource.getRepository("SKILL").delete(skillId);
      if (result.affected === 0) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "failed",
            message: "ID錯誤",
          })
        );
        res.end();
        return;
      }
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
        })
      );
      res.end();
    } catch (error) {
      console.error(error);
      errorHandle(res);
    }
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "failed",
        message: "無此網站路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);

async function startServer() {
  await AppDataSource.initialize();
  console.log("資料庫連接成功");
  server.listen(process.env.PORT);
  console.log(`伺服器啟動成功, port: ${process.env.PORT}`);
  return server;
}

module.exports = startServer();
