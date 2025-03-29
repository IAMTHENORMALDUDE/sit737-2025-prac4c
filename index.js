const express = require("express");
const winston = require("winston");
const app = express();
const port = 3000;

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "enhanced-calculator-microservice" },
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Middleware to log requests
app.use((req, res, next) => {
  const { method, url, query, ip } = req;
  logger.info({ message: `Request received`, method, url, query, ip });
  next();
});

// Helper function to validate numbers
const validateNumbers = (num1, num2 = null) => {
  if (isNaN(num1) || (num2 !== null && isNaN(num2))) {
    return { isValid: false, message: "Invalid input: Parameters must be numbers" };
  }
  return { isValid: true };
};

// Addition endpoint (from 4.1P)
app.get("/add", (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  const validation = validateNumbers(num1, num2);
  if (!validation.isValid) {
    logger.error(`Error in /add: ${validation.message}`);
    return res.status(400).json({ error: validation.message });
  }
  const result = num1 + num2;
  logger.info(`Addition: ${num1} + ${num2} = ${result}`);
  res.json({ result });
});

// Subtraction endpoint (from 4.1P)
app.get("/subtract", (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  const validation = validateNumbers(num1, num2);
  if (!validation.isValid) {
    logger.error(`Error in /subtract: ${validation.message}`);
    return res.status(400).json({ error: validation.message });
  }
  const result = num1 - num2;
  logger.info(`Subtraction: ${num1} - ${num2} = ${result}`);
  res.json({ result });
});

// Multiplication endpoint (from 4.1P)
app.get("/multiply", (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  const validation = validateNumbers(num1, num2);
  if (!validation.isValid) {
    logger.error(`Error in /multiply: ${validation.message}`);
    return res.status(400).json({ error: validation.message });
  }
  const result = num1 * num2;
  logger.info(`Multiplication: ${num1} * ${num2} = ${result}`);
  res.json({ result });
});

// Division endpoint (from 4.1P)
app.get("/divide", (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  const validation = validateNumbers(num1, num2);
  if (!validation.isValid) {
    logger.error(`Error in /divide: ${validation.message}`);
    return res.status(400).json({ error: validation.message });
  }
  if (num2 === 0) {
    logger.error("Error in /divide: Division by zero is not allowed");
    return res.status(400).json({ error: "Division by zero is not allowed" });
  }
  const result = num1 / num2;
  logger.info(`Division: ${num1} / ${num2} = ${result}`);
  res.json({ result });
});

// New endpoint: Exponentiation
app.get("/power", (req, res) => {
  const base = parseFloat(req.query.base);
  const exponent = parseFloat(req.query.exponent);
  const validation = validateNumbers(base, exponent);
  if (!validation.isValid) {
    logger.error(`Error in /power: ${validation.message}`);
    return res.status(400).json({ error: validation.message });
  }
  const result = Math.pow(base, exponent);
  logger.info(`Power: ${base} ^ ${exponent} = ${result}`);
  res.json({ result });
});

// New endpoint: Square Root
app.get("/sqrt", (req, res) => {
  const num = parseFloat(req.query.num);
  const validation = validateNumbers(num);
  if (!validation.isValid) {
    logger.error(`Error in /sqrt: ${validation.message}`);
    return res.status(400).json({ error: validation.message });
  }
  if (num < 0) {
    logger.error("Error in /sqrt: Square root of negative number is not allowed");
    return res.status(400).json({ error: "Square root of negative number is not allowed" });
  }
  const result = Math.sqrt(num);
  logger.info(`Square Root: sqrt(${num}) = ${result}`);
  res.json({ result });
});

// New endpoint: Modulo
app.get("/modulo", (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  const validation = validateNumbers(num1, num2);
  if (!validation.isValid) {
    logger.error(`Error in /modulo: ${validation.message}`);
    return res.status(400).json({ error: validation.message });
  }
  if (num2 === 0) {
    logger.error("Error in /modulo: Modulo by zero is not allowed");
    return res.status(400).json({ error: "Modulo by zero is not allowed" });
  }
  const result = num1 % num2;
  logger.info(`Modulo: ${num1} % ${num2} = ${result}`);
  res.json({ result });
});

// Start the server
app.listen(port, () => {
  logger.info(`Enhanced calculator microservice running on port ${port}`);
});
