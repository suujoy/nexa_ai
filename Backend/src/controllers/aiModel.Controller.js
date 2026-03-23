import aiModel from "../models/aiModel.model.js";

export const createAiModel = async (req, res, next) => {
    try {
        const { name, provider, model } = req.body;

        // validation
        if (!name || !provider || !model) {
            return res.status(400).json({
                success: false,
                message: "name, provider, and model are required",
            });
        }

        // check duplicate (same provider + model)
        const existing = await aiModel.findOne({ provider, model });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Model already exists",
            });
        }

        // create model
        const newModel = await aiModel.create({
            name,
            provider,
            model,
        });

        return res.status(201).json({
            success: true,
            message: "Model created",
            model: newModel,
        });
    } catch (error) {
        next(error);
    }
};

export const getAiModels = async (req, res, next) => {
    try {
        const models = await aiModel.find({});
        return res.status(200).json({
            success: true,
            message: "Models fetched",
            models,
        });
    } catch (error) {
        next(error);
    }
};

export const getAiModelDetails = async (req, res, next) => {
    try {
        const { modelId } = req.params;

        const model = await aiModel.findById(modelId);

        if (!model) {
            return res.status(404).json({
                success: false,
                message: "Model not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Model fetched",
            model,
        });
    } catch (error) {
        next(error);
    }
};

export const updateActiveAiModel = async (req, res, next) => {
    try {
        const { modelId } = req.params;

        const model = await aiModel.findById(modelId);

        if (!model) {
            return res.status(404).json({
                success: false,
                message: "Model not found",
            });
        }

        model.isActive = !model.isActive;
        await model.save();

        return res.status(200).json({
            success: true,
            message: "Model updated",
            model,
        });
    } catch (error) {
        next(error);
    }
};

export const updateDefaultAiModel = async (req, res, next) => {
    try {
        const { modelId } = req.params;

        const model = await aiModel.findById(modelId);

        if (!model) {
            return res.status(404).json({
                success: false,
                message: "Model not found",
            });
        }

        await aiModel.updateMany({ isDefault: true }, { isDefault: false });

        model.isDefault = true;
        await model.save();

        return res.status(200).json({
            success: true,
            message: "Default model updated",
            model,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteAiModel = async (req, res, next) => {
    try {
        const { modelId } = req.params;

        await aiModel.findByIdAndDelete(modelId);

        return res.status(200).json({
            success: true,
            message: "Model deleted",
        });
    } catch (err) {
        next(err);
    }
};

export const getAllActiveAiModels = async (req, res, next) => {
    try {
        const models = await aiModel.find({ isActive: true });
        return res.status(200).json({
            success: true,
            message: "Models fetched",
            models,
        });
    } catch (err) {
        next(err);
    }
};

export const currentDefaultAiModel = async (req, res, next) => {
    try {
        const model = await aiModel.findOne({ isDefault: true });
        return res.status(200).json({
            success: true,
            message: "Model fetched",
            model,
        });
    } catch (err) {
        next(err);
    }
};
