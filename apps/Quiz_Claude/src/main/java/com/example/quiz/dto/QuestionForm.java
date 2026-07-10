package com.example.quiz.dto;

import com.example.quiz.entity.Question;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 問題の登録・更新フォーム。バリデーションを担う。
 *
 * <p>{@code answer} は正解: true=○ / false=×。
 */
public class QuestionForm {

    private Long id;

    @NotBlank(message = "問題文を入力してください")
    @Size(max = 500, message = "問題文は500文字以内で入力してください")
    private String text;

    @NotNull(message = "正解（○か×）を選んでください")
    private Boolean answer;

    @Size(max = 1000, message = "解説は1000文字以内で入力してください")
    private String explanation;

    public QuestionForm() {
    }

    /** 既存エンティティからフォームを生成（編集画面の初期表示用） */
    public static QuestionForm from(Question q) {
        QuestionForm form = new QuestionForm();
        form.id = q.getId();
        form.text = q.getText();
        form.answer = q.getAnswer();
        form.explanation = q.getExplanation();
        return form;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean getAnswer() {
        return answer;
    }

    public void setAnswer(Boolean answer) {
        this.answer = answer;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
