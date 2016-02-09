package com.sevak_avet.fetcher;

import com.sevak_avet.domain.Image;
import org.jinstagram.Instagram;
import org.jinstagram.entity.common.Pagination;
import org.jinstagram.entity.tags.TagMediaFeed;
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

    private List<Image> fetchByTag(String tag) {
        TagMediaFeed feed;
        try {
            feed = instagram.getRecentMediaTags(tag);
        } catch (InstagramException e) {
            throw new RuntimeException(e);
        }

        List<Image> imageUrls = feed.getData().stream().map(Image::new).collect(Collectors.toList());
        Pagination pagination = feed.getPagination();

        int i=0;//only 10 pages (10*20 = 200 images)
        while (++i < 10 && pagination.getNextMaxTagId() != null) {
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

    private List<Image> fetchByTag(LocalDateTime fromDate, LocalDateTime toDate, String tag) {
        return fetchByTag(tag)
                .stream()
                .filter(x -> (fromDate==null || x.getDate().isAfter(fromDate)) && (toDate==null || x.getDate().isBefore(toDate)))
                .collect(Collectors.toList());
    }

    public List<Image> fetchByTags(LocalDateTime fromDate, LocalDateTime toDate, ArrayList<String> tags) {

        LinkedHashSet<Image> imagesSet = new LinkedHashSet<>();

        for (String tag : tags) {
            imagesSet.addAll(fetchByTag(fromDate, toDate, tag));
        }

        if(tags.size() > 1) {
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

        ArrayList <Image> imagesList = new ArrayList<>(imagesSet);
        return imagesList;
    }



    @Override
    public String getEmbeddedHtml(String url) {
        return null;
    }

    @Override
    public String chooseLucky(LocalDateTime fromDate, LocalDateTime toDate, String... tags) {
        return null;
    }
}