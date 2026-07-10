package com.example.quiz.controller;

import com.example.quiz.entity.Question;
import com.example.quiz.service.QuestionService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * ゲーム（○×クイズ）画面と、出題用の問題データ提供を担うコントローラ。
 */
@Controller
public class GameController {

    private final QuestionService service;

    public GameController(QuestionService service) {
        this.service = service;
    }

    /** ○×ゲーム画面 */
    @GetMapping("/game")
    public String game(Model model) {
        model.addAttribute("questionCount", service.count());
        return "game/play";
    }

    /**
     * パズル（ドラッグ&ドロップ）ミニゲーム画面。
     * ゲームは完全にクライアントJSで動くため、DB・モデルは不要。
     */
    @GetMapping("/puzzle")
    public String puzzle() {
        return "game/puzzle";
    }

    /**
     * ぴったりストップ・タイマー ミニゲーム画面。
     * こちらもクライアントJSのみで完結する（DB非依存）。
     */
    @GetMapping("/timer")
    public String timer() {
        return "game/timer";
    }

    /**
     * 出題用の問題一覧を JSON で返す。
     * クライアント側でシャッフル・出題・採点を行う。
     */
    @GetMapping("/api/game/questions")
    @ResponseBody
    public List<QuestionView> questions() {
        return service.findAll().stream()
                .map(QuestionView::from)
                .toList();
    }

    /** 出題用に必要な項目だけを返す View（JSON シリアライズ対象） */
    public record QuestionView(Long id, String text, boolean answer, String explanation) {
        static QuestionView from(Question q) {
            return new QuestionView(q.getId(), q.getText(), q.getAnswer(), q.getExplanation());
        }
    }
}
