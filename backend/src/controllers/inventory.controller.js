"use strict";
import Inventory from "../entity/inventory.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createInventoryValidation, updateInventoryValidation } from "../validations/inventory.validation.js";
import { IdParamValidation } from "../validations/idparam.validation.js";

export async function getInventories(req, res) {
  try {
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const inventories = await inventoryRepository.find({
      relations: ["user"],
      select: {
        id: true,
        itemName: true,
        quantity: true,
        description: true,
        unitPrice: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          username: true,
        }
      }
    });
    res.status(200).json(inventories);
  } catch (error) {
    console.error("Error al obtener los Items.", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getInventoryById(req, res) {
  try {
    const { error: paramError } = IdParamValidation.validate(req.params);
    if (paramError) {
      return res.status(400).json({ message: paramError.message });
    }

    const { id } = req.params;
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const inventory = await inventoryRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["user"],
      select: {
        id: true,
        itemName: true,
        quantity: true,
        description: true,
        unitPrice: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          username: true,
        }
      }
    });

    if (!inventory) {
      return res.status(404).json({ message: "Item no encontrado." });
    }

    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error al obtener el Item por ID.", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createInventory(req, res) {
  try {
    const { error: bodyError } = createInventoryValidation.validate(req.body);
    if (bodyError) {
      return res.status(400).json({ message: bodyError.message });
    }

    const user = req.user;
    const { itemName, quantity, description, unitPrice } = req.body;

    const inventoryRepository = AppDataSource.getRepository(Inventory);
    
    const existingItem = await inventoryRepository.findOne({
      where: { itemName: itemName.trim() }
    });
    if (existingItem) {
      return res.status(400).json({ message: "Ya existe un Item con ese nombre." });
    }

    const newInventory = inventoryRepository.create({
      itemName: itemName.trim(),
      quantity,
      description: description.trim(),
      unitPrice,
      user
    });

    await inventoryRepository.save(newInventory);
    
    const savedInventory = await inventoryRepository.findOne({
      where: { id: newInventory.id },
      relations: ["user"],
      select: {
        id: true,
        itemName: true,
        quantity: true,
        description: true,
        unitPrice: true,
        status: true,
        createdAt: true,
        user: {
          username: true,
        }
      }
    });

    res.status(201).json(savedInventory);
  } catch (error) {
    console.error("Error al crear el Item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateInventoryById(req, res) {
  try {
    const { error: paramError } = IdParamValidation.validate(req.params);
    if (paramError) {
      return res.status(400).json({ message: paramError.message });
    }

    const { error: bodyError } = updateInventoryValidation.validate(req.body);
    if (bodyError) {
      return res.status(400).json({ message: bodyError.message });
    }

    const { id } = req.params;
    const { itemName, quantity, description, unitPrice } = req.body;

    const inventoryRepository = AppDataSource.getRepository(Inventory);
    
    const inventory = await inventoryRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["user"]
    });

    if (!inventory) {
      return res.status(404).json({ message: "Item no encontrado." });
    }

    if (itemName && itemName.trim() !== inventory.itemName) {
      const existingItem = await inventoryRepository.findOne({
        where: { itemName: itemName.trim() }
      });

    if (existingItem) {
        return res.status(400).json({ message: "Ya existe un item con ese nombre." });
      }
    }

    if (itemName !== undefined) inventory.itemName = itemName.trim();
    if (quantity !== undefined) inventory.quantity = quantity;
    if (description !== undefined) inventory.description = description.trim();
    if (unitPrice !== undefined) inventory.unitPrice = unitPrice;

    if (inventory.quantity === 0) {
      inventory.status = "out_of_stock";
    } else if (inventory.quantity > 0 && inventory.status === "out_of_stock") {
      inventory.status = "available"; 
    }

    inventory.updatedAt = new Date();

    await inventoryRepository.save(inventory);

    const updatedInventory = await inventoryRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["user"],
      select: {
        id: true,
        itemName: true,
        quantity: true,
        description: true,
        unitPrice: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          username: true,
        }
      }
    });

    res.status(200).json({
      message: "Item actualizado exitosamente.",
      inventory: updatedInventory
    });
  } catch (error) {
    console.error("Error al actualizar el Item por ID.", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteInventoryById(req, res) {
  try {

    const { error: paramError } = IdParamValidation.validate(req.params);
    if (paramError) {
      return res.status(400).json({ message: paramError.message });
    }

    const { id } = req.params;
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    
    const inventory = await inventoryRepository.findOne({ 
      where: { id: parseInt(id) }
    });

    if (!inventory) {
      return res.status(404).json({ message: "Item no encontrado." });
    }

    await inventoryRepository.remove(inventory);

    res.status(200).json({ message: "Item eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar el Item por ID.", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
