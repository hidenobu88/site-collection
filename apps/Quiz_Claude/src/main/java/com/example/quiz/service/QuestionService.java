package com.example.quiz.service;

import com.example.quiz.dto.QuestionForm;
import com.example.quiz.entity.Question;
import com.example.quiz.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * 問題に関する業務処理。
 *
 * <p><b>トランザクション方針</b>: 本サービスにトランザクション境界を集約する。
 * 参照系は {@code readOnly=true}、更新系は書込トランザクションとし、
 * 実行時例外が発生した場合はロールバックする。
 */
@Service
@Transactional(readOnly = true)
public class QuestionService {

    private final QuestionRepository repository;

    public QuestionService(QuestionRepository repository) {
        this.repository = repository;
    }

    /** 全問題を作成日時順で取得（一覧表示・出題用） */
    public List<Question> findAll() {
        return repository.findAllByOrderByCreatedAtAsc();
    }

    /** IDで1件取得。存在しなければ例外。 */
    public Question findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("問題が見つかりません: id=" + id));
    }

    /** 問題数 */
    public long count() {
        return repository.count();
    }

    /**
     * 新規登録。
     * 書込トランザクション内で保存し、例外時はロールバックされる。
     */
    @Transactional
    public Question create(QuestionForm form) {
        Question question = new Question(
                form.getText(),
                form.getAnswer(),
                normalize(form.getExplanation()));
        return repository.save(question);
    }

    /**
     * 更新。
     * 対象が存在しなければ例外を送出し、トランザクションをロールバックする。
     * 取得したエンティティの変更は、トランザクション内のダーティチェックで反映される。
     */
    @Transactional
    public Question update(Long id, QuestionForm form) {
        Question question = findById(id);
        question.update(
                form.getText(),
                form.getAnswer(),
                normalize(form.getExplanation()));
        return question;
    }

    /**
     * 削除。
     * 対象が存在しなければ例外を送出し、トランザクションをロールバックする。
     */
    @Transactional
    public void delete(Long id) {
        Question question = findById(id);
        repository.delete(question);
    }

    /** 空文字は null に寄せる（解説は任意項目のため） */
    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
