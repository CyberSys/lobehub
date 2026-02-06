import { ModelIcon } from '@lobehub/icons';
import { Flexbox, Text } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { type AiModelForSelect, type ModelPriceCurrency, type Pricing } from 'model-bank';
import { type FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { ModelInfoTags } from '@/components/ModelSelect';
import { formatPriceByCurrency, getTextInputUnitRate, getTextOutputUnitRate } from '@/utils/index';

const styles = createStaticStyles(({ css, cssVar }) => ({
  container: css`
    padding: 16px;
  `,
  description: css`
    font-size: 12px;
    line-height: 1.5;
    color: ${cssVar.colorTextSecondary};
  `,
  meta: css`
    font-size: 12px;
    line-height: 1.5;
    color: ${cssVar.colorTextTertiary};
  `,
}));

const getPrice = (pricing: Pricing) => {
  const inputRate = getTextInputUnitRate(pricing);
  const outputRate = getTextOutputUnitRate(pricing);

  const inputPrice = inputRate
    ? formatPriceByCurrency(inputRate, pricing?.currency as ModelPriceCurrency)
    : '0';
  const outputPrice = outputRate
    ? formatPriceByCurrency(outputRate, pricing?.currency as ModelPriceCurrency)
    : '0';

  return {
    input: Number(inputPrice),
    output: Number(outputPrice),
  };
};

interface ModelDetailPanelProps {
  model: AiModelForSelect;
}

const ModelDetailPanel: FC<ModelDetailPanelProps> = memo(({ model }) => {
  const { t } = useTranslation('components');
  const { t: tModels } = useTranslation('models');

  const hasPricing = !!model.pricing;
  const formatPrice = hasPricing ? getPrice(model.pricing!) : null;

  return (
    <Flexbox className={styles.container} gap={12}>
      {/* Header + Abilities */}
      <Flexbox align={'center'} gap={8} horizontal justify={'space-between'}>
        <Flexbox align={'center'} gap={8} horizontal style={{ minWidth: 0, overflow: 'hidden' }}>
          <ModelIcon model={model.id} size={28} />
          <Text ellipsis style={{ fontSize: 14, fontWeight: 500 }}>
            {model.displayName || model.id}
          </Text>
        </Flexbox>
        <ModelInfoTags
          contextWindowTokens={model.contextWindowTokens}
          {...model.abilities}
          disableTooltip
          placement={'right'}
        />
      </Flexbox>

      {/* Released Date + Pricing */}
      {(model.releasedAt || (hasPricing && formatPrice)) && (
        <span className={styles.meta}>
          {model.releasedAt && t('ModelSwitchPanel.detail.releasedAt', { date: model.releasedAt })}
          {model.releasedAt && hasPricing && formatPrice && ' · '}
          {hasPricing &&
            formatPrice &&
            `${t('ModelSwitchPanel.detail.pricing.input')} $${formatPrice.input}/M · ${t('ModelSwitchPanel.detail.pricing.output')} $${formatPrice.output}/M`}
        </span>
      )}

      {/* Description */}
      {model.description && (
        <div className={styles.description}>{tModels(`${model.id}.description`)}</div>
      )}
    </Flexbox>
  );
});

ModelDetailPanel.displayName = 'ModelDetailPanel';

export default ModelDetailPanel;
