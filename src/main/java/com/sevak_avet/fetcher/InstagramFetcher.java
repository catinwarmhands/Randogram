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
    List<T> fetchByTags(LocalDateTime fromDate, LocalDateTime toDate, ArrayList<String> tags);
    String getEmbeddedHtml(String url);
    String chooseLucky(LocalDateTime fromDate, LocalDateTime toDate, String ... tags);
}
