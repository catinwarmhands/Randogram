<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="common/header.jsp"/>

<body role="document">
<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="/">Randogram</a>
        </div>
        <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="/">Profile</a></li>
            </ul>
        </div>
    </div>
</nav>

<div class="container">
    <div class="row">
        <div class="row">
            <form id="bootstrapTagsInputForm" method="post" action="/load" class="form-horizontal">
                <div class='col-sm-6'>
                    <div class="form-group">
                        <label for="dateTimeFrom">From: </label>

                        <div class='input-group date'>
                            <input type='text' name="dateTimeFrom" id="dateTimeFrom" class="form-control"/>
                            <span class="input-group-addon">
                                <span class="glyphicon glyphicon-calendar"></span>
                            </span>
                        </div>
                    </div>
                </div>

                <div class='col-sm-6'>
                    <div class="form-group">
                        <label for="dateTimeTo">To: </label>

                        <div class='input-group date'>
                            <input type='text' name="dateTimeTo" id="dateTimeTo" class="form-control"/>
                            <span class="input-group-addon">
                                <span class="glyphicon glyphicon-calendar"></span>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="row col-lg-12">
                    <label class="control-label" for="tags">Tags:</label>
                    <input type="text" name="tags" id="tags" class="form-control" data-role="tagsinput"/>
                </div>
                <div class="row col-lg-12">
                    <button type="submit" name="search" class="btn btn-lg btn-success">Search</button>
                    <button type="submit" name="chooseLucky" class="btn btn-lg btn-info">Who is lucky?</button>
                </div>
            </form>
        </div>

        <div id="blueimp-gallery" class="blueimp-gallery">
            <!-- The container for the modal slides -->
            <div class="slides"></div>
            <!-- Controls for the borderless lightbox -->
            <h3 class="title"></h3>
            <a class="prev">‹</a>
            <a class="next">›</a>
            <a class="close">×</a>
            <a class="play-pause"></a>
            <ol class="indicator"></ol>
            <!-- The modal dialog, which will be used to wrap the lightbox content -->
            <div class="modal fade">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" aria-hidden="true">&times;</button>
                            <h4 class="modal-title"></h4>
                        </div>
                        <div class="modal-body next"></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default pull-left prev">
                                <i class="glyphicon glyphicon-chevron-left"></i>
                                Previous
                            </button>
                            <button type="button" class="btn btn-primary next">
                                Next
                                <i class="glyphicon glyphicon-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="links">
            <c:forEach var="image" items="${images}">
                <a href="${image.standard}" data-gallery>
                    <img src="${image.thumbnail}">
                </a>
            </c:forEach>
        </div>


        <button type="submit" name="loadMore" class="btn btn-lg btn-info" onclick="someAjax()">Load more</button>
    </div>
    <hr>

<jsp:include page="common/footer.jsp"/>