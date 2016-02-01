package com.sevak_avet.controllers;

import com.sevak_avet.domain.Image;
import com.sevak_avet.fetcher.InstagramFetcher;
import org.apache.log4j.Logger;
import org.jinstagram.auth.oauth.InstagramService;
import org.jinstagram.exceptions.InstagramException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

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

    @RequestMapping(value = "/", method = GET)
    public String index(HttpSession session) {
        return "index";
    }

    @RequestMapping(value = "/load", method = POST)
    public String loadImages(@RequestParam("tags") String tagsString,
                             @RequestParam("dateTimeFrom") String from,
                             @RequestParam("dateTimeTo") String to,
                             ModelMap params,
                             HttpSession session,
                             HttpServletRequest req) throws InstagramException {
        if (req.getParameter("chooseLucky") != null) {
            return "index";
        }

        if (tagsString.isEmpty()) {
            return "index";
        }

        String[] tags = tagsString.split(",");
        session.setAttribute("tags", tags);

//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm a");
//        LocalDateTime fromDate = LocalDateTime.parse(from, formatter);
//        LocalDateTime toDate = LocalDateTime.parse(to, formatter);
//        params.addAttribute("images", fetcher.fetchByTags(fromDate, toDate, tags));

        return "index";
    }
}
