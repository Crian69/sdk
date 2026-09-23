<script setup lang="ts">
import ColorPicker from "../ColorPicker.vue";
import SlidingPillSelect from "../SlidingPillSelect.vue";
import NumberWithSuffix from "./NumberWithSuffix.vue";
import { useI18n } from "../../composables/useI18n";
import { labelClass } from "../../constants/styleConstants";
import type { BorderStyle, BorderValue } from "@templatical/types";

const props = defineProps<{
  modelValue: BorderValue | undefined;
  /** Prefix for the width input's `data-testid`, e.g. `"image"`. */
  testidPrefix: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: BorderValue | undefined): void;
}>();

const { t } = useI18n();

// What a border starts as the first time a width is entered.
const DEFAULT_BORDER: Omit<BorderValue, "width"> = {
  style: "solid",
  color: "#000000",
};

function updateWidth(width: number): void {
  // 0 removes the border entirely rather than storing a `0px` one, matching
  // the renderer, which emits nothing for a non-positive width.
  if (!(width > 0)) {
    emit("update:modelValue", undefined);
    return;
  }
  emit("update:modelValue", {
    ...DEFAULT_BORDER,
    ...props.modelValue,
    width,
  });
}

function updateField(patch: Partial<BorderValue>): void {
  if (!props.modelValue) return;
  emit("update:modelValue", { ...props.modelValue, ...patch });
}
</script>

<template>
  <div class="tpl:mb-3.5">
    <label :class="labelClass">{{ t.blockSettings.borderWidth }}</label>
    <NumberWithSuffix
      :model-value="modelValue?.width ?? 0"
      :min="0"
      suffix="px"
      :testid="`${testidPrefix}-border-width-input`"
      @update:model-value="updateWidth"
    />
  </div>
  <template v-if="modelValue">
    <div class="tpl:mb-3.5">
      <label :class="labelClass">{{ t.blockSettings.borderStyle }}</label>
      <SlidingPillSelect
        :options="[
          { value: 'solid', label: t.divider.solid },
          { value: 'dashed', label: t.divider.dashed },
          { value: 'dotted', label: t.divider.dotted },
        ]"
        :model-value="modelValue.style"
        @update:model-value="updateField({ style: $event as BorderStyle })"
      />
    </div>
    <div class="tpl:mb-3.5">
      <label :class="labelClass">{{ t.blockSettings.borderColor }}</label>
      <ColorPicker
        :model-value="modelValue.color"
        @update:model-value="updateField({ color: $event })"
      />
    </div>
  </template>
</template>
