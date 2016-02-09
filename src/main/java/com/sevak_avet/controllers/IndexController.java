package com.sevak_avet.controllers;

import com.sevak_avet.domain.Image;
import com.google.gson.Gson;
import com.sevak_avet.fetcher.InstagramFetcher;
import org.apache.log4j.Logger;
import org.jinstagram.Instagram;
import org.jinstagram.auth.InstagramAuthService;
import org.jinstagram.auth.model.Token;
import org.jinstagram.auth.model.Verifier;
import org.jinstagram.auth.oauth.InstagramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by Avetisyan Sevak
 * Date: 15.05.2015
 * Time: 11:25
 */
@Controller
public class IndexController {
    private static Logger log = Logger.getLogger(IndexController.class.getName());

    @Autowired
    private InstagramFetcher<Image> fetcher;

    @Autowired
    private InstagramService instagramService;

    @RequestMapping(value = "/login", method = GET)
    @ResponseBody
    public String login (HttpSession session, HttpServletRequest request) {

        InstagramService service = new InstagramAuthService()
                .apiKey("your_client_id")
                .apiSecret("your_client_secret")
                .callback("your_callback_url")
                .scope("comments")
                .build();

        ///////////////////////////////////////////////////////////////////////
//        Properties properties = InstagramUtils.getConfigProperties();
//        String clientId = properties.getProperty(Constants.CLIENT_ID);
//        String clientSecret = properties.getProperty(Constants.CLIENT_SECRET);
//        String callbackUrl = properties.getProperty(Constants.REDIRECT_URI);
//        InstagramService service = new InstagramAuthService()
//                .apiKey(clientId)
//                .apiSecret(clientSecret)
//                .callback(callbackUrl)
//                .build();
//        String authorizationUrl = service.getAuthorizationUrl(null);
//        session.setAttribute(Constants.INSTAGRAM_SERVICE, service);
        ///////////////////////////////////////////////////////////////////////
//        return tagsString;
        String code = request.getParameter("code");
        if (code == null) {
            return "null";
        }
        Verifier verifier = new Verifier(code);
        Token accessToken = instagramService.getAccessToken(null, verifier);
        Instagram instagram = new Instagram(accessToken);
        session.setAttribute("instagram", instagram);
        return "redirect:/index";

    }

    @RequestMapping(value = "/getImagesByTags", method = GET)
    @ResponseBody
    public String getImages (@RequestParam("tags") String tagsString,
                             @RequestParam("dateTimeFrom") String from,
                             @RequestParam("dateTimeTo") String to) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm a");
        LocalDateTime fromDate = from==""? null: LocalDateTime.parse(from, formatter);
        LocalDateTime toDate = to==""? null: LocalDateTime.parse(to, formatter);

        List<Image> images = fetcher.fetchByTags(fromDate, toDate, tagsString);

        Gson gson = new Gson();
        return gson.toJson(images);
    }
}
