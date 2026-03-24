import AiModelCard from "./AiModelCard";
import AiModelEmptyState from "./AiModelEmptyState";

const AiModelList = ({
    aiModels,
    onToggleActive,
    onSetDefault,
    isBusy = false,
}) => {
    if (!aiModels.length) {
        return <AiModelEmptyState />;
    }

    return (
        <div className="grid gap-4">
            {aiModels.map((model) => (
                <AiModelCard
                    key={model._id}
                    model={model}
                    onToggleActive={onToggleActive}
                    onSetDefault={onSetDefault}
                    isBusy={isBusy}
                />
            ))}
        </div>
    );
};

export default AiModelList;
