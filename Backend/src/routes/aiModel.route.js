import { Router } from "express";
import {
    createAiModel,
    currentDefaultAiModel,
    deleteAiModel,
    getAiModelDetails,
    getAiModels,
    getAllActiveAiModels,
    updateActiveAiModel,
    updateDefaultAiModel,
} from "../controllers/aiModel.Controller.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { identifyUser } from "../middlewares/auth.middleware.js";

const aiModelRouter = Router();

aiModelRouter.post("/create", identifyUser, isAdmin, createAiModel);
aiModelRouter.get("/all", getAiModels);
aiModelRouter.get("/active", getAllActiveAiModels);
aiModelRouter.get("/default", currentDefaultAiModel);
aiModelRouter.get("/detail/:modelId", getAiModelDetails);

aiModelRouter.patch(
    "/active/:modelId",
    identifyUser,
    isAdmin,
    updateActiveAiModel,
);
aiModelRouter.patch(
    "/default/:modelId",
    identifyUser,
    isAdmin,
    updateDefaultAiModel,
);
aiModelRouter.delete("/delete/:modelId", identifyUser, isAdmin, deleteAiModel);

export default aiModelRouter;
