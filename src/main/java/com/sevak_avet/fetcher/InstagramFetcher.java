package com.sevak_avet.fetcher;

import org.jinstagram.exceptions.InstagramException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by savetisyan on 14/01/16
 */
public interface InstagramFetcher<T> {
    List<T> fetchByTags(String token, ArrayList<String> tags, String following, LocalDateTime fromDate, LocalDateTime toDate);
    List<T> fetchFirst(String token, ArrayList<String> tags, int amount);
    long getTagAmount(String tag);
    String getSmallestTag(ArrayList<String> tags);
}
