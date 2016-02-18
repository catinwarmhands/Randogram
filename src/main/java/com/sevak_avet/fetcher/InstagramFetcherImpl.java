package com.sevak_avet.fetcher;

import com.sevak_avet.domain.Image;
import org.jinstagram.Instagram;
import org.jinstagram.auth.model.Token;
import org.jinstagram.auth.model.Verifier;
import org.jinstagram.entity.common.Pagination;
import org.jinstagram.entity.tags.TagInfoData;
import org.jinstagram.entity.tags.TagInfoFeed;
import org.jinstagram.entity.tags.TagMediaFeed;
import org.jinstagram.entity.users.feed.UserFeed;
import org.jinstagram.entity.users.feed.UserFeedData;
import org.jinstagram.exceptions.InstagramException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by savetisyan on 14/01/16
 */
@Component
public class InstagramFetcherImpl implements InstagramFetcher<Image> {

    @Autowired
    private Instagram instagram;

    @Autowired
    private String secret;

    private List<Image> fetchByTag(String tag, int amount) {

        TagMediaFeed feed;
        try {
            feed = instagram.getRecentMediaTags(tag);
        } catch (InstagramException e) {
            throw new RuntimeException(e);
        }

        List<Image> imageUrls = feed.getData().stream().map(Image::new).collect(Collectors.toList());
        Pagination pagination = feed.getPagination();

        int i = 0;
        while (i++ != amount && pagination.getNextMaxTagId() != null) {
            try {
                feed = instagram.getRecentMediaTags(tag, null, pagination.getNextMaxTagId());
            } catch (InstagramException e) {
                throw new RuntimeException(e);
            }

            imageUrls.addAll(feed.getData().stream().map(Image::new).collect(Collectors.toSet()));
            pagination = feed.getPagination();
        }

        return imageUrls;
    }

    private List<Image> fetchByTag(String tag, LocalDateTime fromDate, LocalDateTime toDate) {

        return fetchByTag(tag, -1)
                .stream()
                .filter(x -> (fromDate==null || x.getDate().isAfter(fromDate)) && (toDate==null || x.getDate().isBefore(toDate)))
                .collect(Collectors.toList());
    }

    private void setToken(String token){
        Token accessToken = null;
        try{
            accessToken = new Token(token, secret);
        }catch(Exception e){
            throw new RuntimeException();
        }
        try{
            instagram.setAccessToken(accessToken);
        }catch(Exception e){
            throw new RuntimeException();
        }
    }
////this method calls from IndexController
    public List<Image> fetchByTags(String token, ArrayList<String> tags, boolean isFollowing, LocalDateTime fromDate, LocalDateTime toDate) {
        setToken(token);

        LinkedHashSet<Image> imagesSet = new LinkedHashSet<>();
        imagesSet.addAll(fetchByTag(getSmallestTag(tags), fromDate, toDate));

        if(isFollowing) {filterByFollowing(imagesSet);}
        if(tags.size() > 1) {filterByTagsConjunction(tags, imagesSet);}

        ArrayList <Image> imagesList = new ArrayList<>(imagesSet);
        return imagesList;
    }

    public List<Image> fetchFirst(String token, ArrayList<String> tags, int amount) {
        setToken(token);
        return fetchByTag(getSmallestTag(tags), amount);
    }

    private void filterByTagsConjunction(ArrayList<String> tags, LinkedHashSet<Image> imagesSet) {
        Iterator<Image> i = imagesSet.iterator();

        while (i.hasNext()) {
            Image image = i.next();

            boolean ok = true;
            for (String tag : tags) {
                if (!image.getTags().contains(tag)) {
                    ok = false;
                    break;
                }
            }
            if (!ok) {
                i.remove();
            }
        }
    }

    private void filterByFollowing(LinkedHashSet<Image> imagesSet) {
        Iterator<Image> i = imagesSet.iterator();

        long userId = 1608843858; //griddynamics_saratov user id
        UserFeed followers;
        try {
            followers = instagram.getUserFollowedByList(""+userId);
        } catch (InstagramException e) {
            throw new RuntimeException(e);
        }

        List<UserFeedData> followersList = followers.getUserList();
        List<String> followersIdList = new ArrayList<>();

        for(UserFeedData u : followersList){
            followersIdList.add(u.getId());
        }

        while (i.hasNext()) {
            Image image = i.next();

            if(!followersIdList.contains(image.getUser().getId())){
                i.remove();
            }
        }
    }

    private String getSmallestTag(ArrayList<String> tags){
        if(tags.size() == 1){
            return tags.get(0);
        }

        String minTag = null;
        long minAmount = Long.MAX_VALUE;

        for(String tag : tags){
            TagInfoFeed feed;
            try {
                feed = instagram.getTagInfo(tag);
            } catch (InstagramException e) {
                throw new RuntimeException(e);
            }
            TagInfoData tagData = feed.getTagInfo();

            if(tagData.getMediaCount() < minAmount){
                minAmount = tagData.getMediaCount();
                minTag = tag;
            }
        }
        return minTag;
    }
}