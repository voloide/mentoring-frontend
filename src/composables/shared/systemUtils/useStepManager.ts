import { ref, computed } from 'vue';

export default function useStepManager(step) {
  // Computed properties to control visibility of steps
  const isSearchStep = computed(() => step.value === 'search');
  const isCreateStep = computed(() => step.value === 'create');
  const isEditStep = computed(() => step.value === 'edit');
  const isDisplayStep = computed(() => step.value === 'display');
  const isPrintStep = computed(() => step.value === 'print');
  const isEditOrCreate = computed(() => step.value === 'edit' || step.value === 'create');

  // Functions to set the current step
  const changeToCreateStep = () => {
    step.value = 'create';
  };

  const changeToEditStep = () => {
    step.value = 'edit';
  };

  const changeToDisplayStep = () => {
    step.value = 'display';
  };

  const changeToPrintStep = () => {
    step.value = 'print';
  };

  const changeToSearchStep = () => {
    step.value = 'search';
  };

  // Function to print the current step
const printCurrentStep = () => {
    console.log(`Current Step: ${step.value}`);
  };

  return {
    // Computed properties for the steps
    isSearchStep,
    isCreateStep,
    isEditStep,
    isDisplayStep,
    isPrintStep,
    isEditOrCreate,

    // Functions to change steps
    changeToCreateStep,
    changeToEditStep,
    changeToDisplayStep,
    changeToPrintStep,
    changeToSearchStep,

    printCurrentStep,
  };
}
