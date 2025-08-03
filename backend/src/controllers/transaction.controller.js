"use strict";
import Transaction from "../entity/transaction.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createTransactionValidation, updateTransactionValidation } from "../validations/transaction.validation.js";
import { IdParamValidation } from "../validations/idparam.validation.js";

export async function getTransactions(req, res) {
    try {
        const transactionRepository = AppDataSource.getRepository(Transaction);
        const transactions = await transactionRepository.find({
            relations: ["user"],
            select: {
                id: true,
                amount: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    username: true, 
                }
            }
        });
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error al obtener las transacciones.", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getTransactionById(req, res) {
    try {
        const { error: paramError } = IdParamValidation.validate(req.params);
        if (paramError) {
            return res.status(400).json({ message: paramError.message });
        }

        const transactionRepository = AppDataSource.getRepository(Transaction);
        const { id } = req.params;
        const transaction = await transactionRepository.findOne({
            where: { id: parseInt(id) },
            relations: ["user"],
            select: {
                id: true,
                amount: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    username: true,
                }
            }
        });
        
        if (!transaction) {
            return res.status(404).json({ message: "Transaccion no encontrada." });
        }
        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error al obtener la transaccion.", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createTransaction(req, res) {
    try {
        const { error: bodyError } = createTransactionValidation.validate(req.body);
        if (bodyError) {
            return res.status(400).json({ message: bodyError.message });
        }

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Usuario no autenticado." });
        }

        const transactionRepository = AppDataSource.getRepository(Transaction);
        const { amount, description } = req.body;

        const newTransaction = transactionRepository.create({
            amount,
            description,
            user,
        });

        await transactionRepository.save(newTransaction);

        const savedTransaction = await transactionRepository.findOne({
            where: { id: newTransaction.id },
            relations: ["user"],
            select: {
                id: true,
                amount: true,
                description: true,
                status: true,
                createdAt: true,
                user: {
                    username: true,
                }
            }
        });
        
        res.status(201).json(savedTransaction);
    } catch (error) {
        console.error("Error al crear la transaccion.", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateTransactionById(req, res) {
    try {
        const { error: paramError } = IdParamValidation.validate(req.params);
        if (paramError) {
            return res.status(400).json({ message: paramError.message });
        }

        const { error: bodyError } = updateTransactionValidation.validate(req.body);
        if (bodyError) {
            return res.status(400).json({ message: bodyError.message });
        }

        const transactionRepository = AppDataSource.getRepository(Transaction);
        const { id } = req.params;
        const { amount, description, status } = req.body;

        const transaction = await transactionRepository.findOne({
            where: { id: parseInt(id) },
            relations: ["user"], 
        });
        
        if (!transaction) {
            return res.status(404).json({ message: "Transaccion no encontrada." });
        }

        transaction.amount = amount !== undefined ? amount : transaction.amount;
        transaction.description = description !== undefined ? description : transaction.description;
        transaction.status = status !== undefined ? status : transaction.status;

        transaction.updatedAt = new Date();

        await transactionRepository.save(transaction);

        const updatedTransaction = await transactionRepository.findOne({
            where: { id: parseInt(id) },
            relations: ["user"],
            select: {
                id: true,
                amount: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    username: true, 
                }
            }
        });

        res.status(200).json({ 
            message: "Transaccion actualizada exitosamente.", 
            transaction: updatedTransaction 
        });
    } catch (error) {
        console.error("Error al actualizar la transaccion.", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteTransactionById(req, res) {
    try {
        const { error: paramError } = IdParamValidation.validate(req.params);
        if (paramError) {
            return res.status(400).json({ message: paramError.message });
        }

        const transactionRepository = AppDataSource.getRepository(Transaction);
        const { id } = req.params;

        const transaction = await transactionRepository.findOneBy({ id: parseInt(id) });
        if (!transaction) {
            return res.status(404).json({ message: "Transaccion no encontrada." });
        }

        await transactionRepository.remove(transaction);
        res.status(200).json({ message: "Transaccion eliminada exitosamente." });
    } catch (error) {
        console.error("Error al eliminar la transaccion.", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
