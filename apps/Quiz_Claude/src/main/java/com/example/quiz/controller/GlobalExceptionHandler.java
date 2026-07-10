package com.example.quiz.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.NoSuchElementException;

/**
 * 画面共通の例外ハンドリング。
 * 存在しない問題を操作した場合などは、一覧へ戻してメッセージを表示する。
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    public String handleNotFound(NoSuchElementException e, RedirectAttributes redirectAttributes) {
        redirectAttributes.addFlashAttribute("message", "対象の問題が見つかりませんでした。");
        return "redirect:/questions";
    }
}
