import QuestionCategory from "src/stores/model/question/QuestionCategory";

export default function useQuestionCatgeory() {

    function createQuestionCategoryFromDTO(questionCategoryDTO: any) {
        return  new QuestionCategory({
            id: questionCategoryDTO.id,
            uuid: questionCategoryDTO.uuid,
            category: questionCategoryDTO.category,
          })
    }

    function createDTOFromQuestionCategory(questionCategory: QuestionCategory) {
        const questionCategoryDTO = {
            id: questionCategory.id,
            uuid: questionCategory.uuid,
            category: questionCategory.category,
          }
        return  questionCategoryDTO;
    }

    return {
        createQuestionCategoryFromDTO,
        createDTOFromQuestionCategory,
      };
}