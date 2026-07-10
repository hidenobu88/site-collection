package com.example.quiz.repository;

import com.example.quiz.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * {@link Question} の永続化を担うリポジトリ。
 */
public interface QuestionRepository extends JpaRepository<Question, Long> {

    /** 作成日時の昇順で全件取得（一覧表示・出題用） */
    List<Question> findAllByOrderByCreatedAtAsc();
}
