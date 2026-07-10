package com.example.quiz.controller;

import com.example.quiz.dto.QuestionForm;
import com.example.quiz.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * トップ画面と、問題の管理（登録・更新・削除・一覧表示）を担うコントローラ。
 *
 * <p>更新系の後は PRG（Post/Redirect/Get）でリダイレクトし、二重送信を防ぐ。
 */
@Controller
public class QuestionController {

    private final QuestionService service;

    public QuestionController(QuestionService service) {
        this.service = service;
    }

    /** トップ画面 */
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("questionCount", service.count());
        return "index";
    }

    /** 一覧表示 */
    @GetMapping("/questions")
    public String list(Model model) {
        model.addAttribute("questions", service.findAll());
        return "questions/list";
    }

    /** 新規登録フォーム */
    @GetMapping("/questions/new")
    public String newForm(Model model) {
        if (!model.containsAttribute("questionForm")) {
            model.addAttribute("questionForm", new QuestionForm());
        }
        model.addAttribute("editing", false);
        return "questions/form";
    }

    /** 新規登録 */
    @PostMapping("/questions")
    public String create(@Valid @ModelAttribute("questionForm") QuestionForm form,
                         BindingResult bindingResult,
                         Model model,
                         RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("editing", false);
            return "questions/form";
        }
        service.create(form);
        redirectAttributes.addFlashAttribute("message", "問題を登録しました🍬");
        return "redirect:/questions";
    }

    /** 編集フォーム */
    @GetMapping("/questions/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        if (!model.containsAttribute("questionForm")) {
            model.addAttribute("questionForm", QuestionForm.from(service.findById(id)));
        }
        model.addAttribute("editing", true);
        model.addAttribute("questionId", id);
        return "questions/form";
    }

    /** 更新 */
    @PostMapping("/questions/{id}")
    public String update(@PathVariable Long id,
                         @Valid @ModelAttribute("questionForm") QuestionForm form,
                         BindingResult bindingResult,
                         Model model,
                         RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("editing", true);
            model.addAttribute("questionId", id);
            return "questions/form";
        }
        service.update(id, form);
        redirectAttributes.addFlashAttribute("message", "問題を更新しました✏️");
        return "redirect:/questions";
    }

    /** 削除 */
    @PostMapping("/questions/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        service.delete(id);
        redirectAttributes.addFlashAttribute("message", "問題を削除しました🗑️");
        return "redirect:/questions";
    }
}
