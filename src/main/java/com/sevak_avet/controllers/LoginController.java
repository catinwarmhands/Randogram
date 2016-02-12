package com.sevak_avet.controllers;

import org.jinstagram.Instagram;
import org.jinstagram.auth.model.Token;
import org.jinstagram.auth.model.Verifier;
import org.jinstagram.auth.oauth.InstagramService;
import org.jinstagram.exceptions.InstagramException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by savetisyan on 26/01/16
 */
@Controller
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private InstagramService instagramService;


    @RequestMapping(value = "/redirect", method = GET)
    @ResponseBody
    public String redirect(){
        String authorizationUrl = instagramService.getAuthorizationUrl(null);

        return authorizationUrl;
    }

    @RequestMapping(value = "/handleToken")
    public String handleToken(HttpSession session, HttpServletRequest request) throws InstagramException {

        String code = request.getParameter("code");
        if (code == null) {
            return "redirect:/";
        }

        Verifier verifier = new Verifier(code);
        Token accessToken = instagramService.getAccessToken(null, verifier);
        return "redirect:/index.html?accesToken="+accessToken.getToken();
    }
}