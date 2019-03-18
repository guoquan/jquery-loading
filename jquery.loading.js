/*
 * jQuery plugin: loading
 * Loading content to a DOM node with Facebook style placeholder.
 * https://github.com/guoquan/jquery-loading
 *
 * Copyright 2019, Guo, Quan
 * https://guoquan.net
 */

/* global jQuery */

const default_template =`
<div class="loading-wrapper">
  <div class="loading-item">
    <div class="animated-background">
      <div class="background-masker header-top"></div>
      <div class="background-masker header-left"></div>
      <div class="background-masker header-right"></div>
      <div class="background-masker header-bottom"></div>
      <div class="background-masker subheader-left"></div>
      <div class="background-masker subheader-right"></div>
      <div class="background-masker subheader-bottom"></div>
      <div class="background-masker content-top"></div>
      <div class="background-masker content-first-end"></div>
      <div class="background-masker content-second-line"></div>
      <div class="background-masker content-second-end"></div>
      <div class="background-masker content-third-line"></div>
      <div class="background-masker content-third-end"></div>
    </div>
  </div>
</div>
`;

const default_reload_template =`
<div class="loading-reload">
Failed to load this content. Click to retry.
</div>
`;

(function($) {
  "use strict";

  $.fn.loading = function(url, done, fail, always, args, options) {
    console.debug(this);
    var options = $.extend({}, $.fn.loading.defaults, options);
    var load_func = function() { // make a closure
      console.debug(this);
      // make local instances of variables,
      // this cannot be propagate through click event
      var $node = this;
      // closure function
      function load() {
        console.debug($node);
        if (options.overwrite) {
          $node.html("");
        }
        $node.append($(options.loading_template)); // make stylish loading
        $.get({
          url: url,
          context: $node
        }).done(function(data, textStatus, jqXHR) {
          console.debug(this, data, textStatus, jqXHR);
          if (typeof(done) != "undefined" && done) {
            var retval = done.call(this, data, textStatus, jqXHR, args);
            if (retval) {
              this.html(retval);
            } else {
              this.html(data);
            }
          }
          if (options.unbind_reload_if_done) {
            this.unbind("click", load);
          }
        }).fail(function(jqXHR, textStatus, statusText) {
          console.error(this, jqXHR, textStatus, statusText);
          if (typeof(fail) != "undefined" && fail) {
            var retval = fail.call(this, jqXHR, textStatus, statusText, args);
            if (retval) {
              this.html(retval);
            } else {
              this.html(statusText);
            }
          } else {
            if (options.reload_overwrite) {
              this.html(options.reload_template);
            } else {
              this.append($(options.reload_template));
            }
          }
        }).always(function(data, textStatus, jqXHR) {
          console.debug(this, data, textStatus, jqXHR);
          if (typeof(always) != "undefined" && always) {
            var retval = always.call(this, data, textStatus, jqXHR, args);
            if (retval) {
              this.append(retval);
            }
          }
        });
      };
      this.click(load);
      return load; // return the closure function
    }.call(this);
    load_func.call(this);
    return this;
  };

  $.fn.loading.defaults = {
    loading_template: default_template,
    overwrite: false,
    reload_template: default_reload_template,
    reload_overwrite: false,
    unbind_reload_if_done: true
  };
})(jQuery);
