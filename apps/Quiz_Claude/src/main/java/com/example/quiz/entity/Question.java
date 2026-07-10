package com.example.quiz.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

/**
 * ○×クイズの1問を表すエンティティ。
 *
 * <p>{@code answer} は正解を表し、{@code true}=○（マル）、{@code false}=×（バツ）。
 */
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 問題文 */
    @Column(name = "text", nullable = false, length = 500)
    private String text;

    /** 正解: true=○（マル） / false=×（バツ） */
    @Column(name = "answer", nullable = false)
    private Boolean answer;

    /** 解説（任意） */
    @Column(name = "explanation", length = 1000)
    private String explanation;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Question() {
        // JPA 用
    }

    public Question(String text, Boolean answer, String explanation) {
        this.text = text;
        this.answer = answer;
        this.explanation = explanation;
    }

    /** 登録時に作成・更新日時を自動設定 */
    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    /** 更新時に更新日時を自動設定 */
    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /** フォーム入力からの値反映（更新用） */
    public void update(String text, Boolean answer, String explanation) {
        this.text = text;
        this.answer = answer;
        this.explanation = explanation;
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public Boolean getAnswer() {
        return answer;
    }

    public String getExplanation() {
        return explanation;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
