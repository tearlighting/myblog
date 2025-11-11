const htmlContent = `<blockquote>
	  <p>阅读本文，你需要首先知道：</p><ol>
	  <li>浏览器的同源策略</li>
	  <li>跨域问题</li>
	  <li>JSONP原理</li>
	  <li>cookie原理</li>
	  </ol>
	  </blockquote>
	  <p>JSONP并不是一个好的跨域解决方案，它至少有着下面两个严重问题：</p><ol>
	  <li><strong>会打乱服务器的消息格式</strong>：JSONP要求服务器响应一段JS代码，但在非跨域的情况下，服务器又需要响应一个正常的JSON格式</li>
	  <li><strong>只能完成GET请求</strong>：JSONP的原理会要求浏览器端生成一个<code>script</code>元素，而<code>script</code>元素发出的请求只能是<code>get</code>请求</li>
	  </ol>
	  <p>所以，CORS是一种更好的跨域解决方案。</p><h1 id="article-md-title-1">概述</h1><p><code>CORS</code>是基于<code>http1.1</code>的一种跨域解决方案，它的全称是<strong>C</strong>ross-<strong>O</strong>rigin <strong>R</strong>esource <strong>S</strong>haring，跨域资源共享。</p><p>它的总体思路是：<strong>如果浏览器要跨域访问服务器的资源，需要获得服务器的允许</strong></p><figure class="markdown-image">
			
			<img style="width:auto" src="http://mdrs.yuanjin.tech/img/image-20200421152122793.png" title="image-20200421152122793" alt="image-20200421152122793">
			<figcaption>image-20200421152122793</figcaption>
		
		  </figure><p>而要知道，一个请求可以附带很多信息，从而会对服务器造成不同程度的影响</p><p>比如有的请求只是获取一些新闻，有的请求会改动服务器的数据</p><p>针对不同的请求，CORS规定了三种不同的交互模式，分别是：</p><ul>
	  <li><strong>简单请求</strong></li>
	  <li><strong>需要预检的请求</strong></li>
	  <li><strong>附带身份凭证的请求</strong></li>
	  </ul>
	  <p>这三种模式从上到下层层递进，请求可以做的事越来越多，要求也越来越严格。</p><p>下面分别说明三种请求模式的具体规范。</p><h1 id="article-md-title-2">简单请求</h1><p>当浏览器端运行了一段ajax代码（无论是使用XMLHttpRequest还是fetch api），浏览器会首先判断它属于哪一种请求模式</p><h2 id="article-md-title-3">简单请求的判定</h2><p>当请求<strong>同时满足</strong>以下条件时，浏览器会认为它是一个简单请求：</p><ol>
	  <li><p><strong>请求方法属于下面的一种：</strong></p><ul>
	  <li>get</li>
	  <li>post</li>
	  <li>head</li>
	  </ul>
	  </li>
	  <li><p><strong>请求头仅包含安全的字段，常见的安全字段如下：</strong></p><ul>
	  <li><code>Accept</code></li>
	  <li><code>Accept-Language</code></li>
	  <li><code>Content-Language</code></li>
	  <li><code>Content-Type</code></li>
	  <li><code>DPR</code></li>
	  <li><code>Downlink</code></li>
	  <li><code>Save-Data</code></li>
	  <li><code>Viewport-Width</code></li>
	  <li><code>Width</code></li>
	  </ul>
	  </li>
	  <li><p><strong>请求头如果包含<code>Content-Type</code>，仅限下面的值之一：</strong></p><ul>
	  <li><code>text/plain</code></li>
	  <li><code>multipart/form-data</code></li>
	  <li><code>application/x-www-form-urlencoded</code></li>
	  </ul>
	  </li>
	  </ol>
	  <p>如果以上三个条件同时满足，浏览器判定为简单请求。</p><p>下面是一些例子：</p><pre><code class="language-js"><span class="hljs-comment">// 简单请求</span>
	  fetch(<span class="hljs-string">"http://crossdomain.com/api/news"</span>);
	  
	  <span class="hljs-comment">// 请求方法不满足要求，不是简单请求</span>
	  fetch(<span class="hljs-string">"http://crossdomain.com/api/news"</span>, {
		<span class="hljs-attr">method</span>:<span class="hljs-string">"PUT"</span>
	  })
	  
	  <span class="hljs-comment">// 加入了额外的请求头，不是简单请求</span>
	  fetch(<span class="hljs-string">"http://crossdomain.com/api/news"</span>, {
		<span class="hljs-attr">headers</span>:{
		  <span class="hljs-attr">a</span>: <span class="hljs-number">1</span>
		}
	  })
	  
	  <span class="hljs-comment">// 简单请求</span>
	  fetch(<span class="hljs-string">"http://crossdomain.com/api/news"</span>, {
		<span class="hljs-attr">method</span>: <span class="hljs-string">"post"</span>
	  })
	  
	  <span class="hljs-comment">// content-type不满足要求，不是简单请求</span>
	  fetch(<span class="hljs-string">"http://crossdomain.com/api/news"</span>, {
		<span class="hljs-attr">method</span>: <span class="hljs-string">"post"</span>,
		<span class="hljs-attr">headers</span>: {
		  <span class="hljs-string">"content-type"</span>: <span class="hljs-string">"application/json"</span>
		}
	  })</code></pre>
	  <h2 id="article-md-title-4">简单请求的交互规范</h2><p>当浏览器判定某个<strong>ajax跨域请求</strong>是<strong>简单请求</strong>时，会发生以下的事情</p><ol>
	  <li><strong>请求头中会自动添加<code>Origin</code>字段</strong></li>
	  </ol>
	  <p>比如，在页面<code>http://my.com/index.html</code>中有以下代码造成了跨域</p><pre><code class="language-js"><span class="hljs-comment">// 简单请求</span>
	  fetch(<span class="hljs-string">"http://crossdomain.com/api/news"</span>);</code></pre>
	  <p>请求发出后，请求头会是下面的格式：</p><pre><code>GET /api/news/ HTTP/1.1
	  Host: crossdomain.com
	  Connection: keep-alive
	  ...
	  Referer: http://my.com/index.html
	  Origin: http://my.com</code></pre><p>看到最后一行没，<code>Origin</code>字段会告诉服务器，是哪个源地址在跨域请求</p><ol start="2">
	  <li><strong>服务器响应头中应包含<code>Access-Control-Allow-Origin</code></strong></li>
	  </ol>
	  <p>当服务器收到请求后，如果允许该请求跨域访问，需要在响应头中添加<code>Access-Control-Allow-Origin</code>字段</p><p>该字段的值可以是：</p><ul>
	  <li>*：表示我很开放，什么人我都允许访问</li>
	  <li>具体的源：比如<code>http://my.com</code>，表示我就允许你访问</li>
	  </ul>
	  <blockquote>
	  <p>实际上，这两个值对于客户端<code>http://my.com</code>而言，都一样，因为客户端才不会管其他源服务器允不允许，就关心自己是否被允许</p><p>当然，服务器也可以维护一个可被允许的源列表，如果请求的<code>Origin</code>命中该列表，才响应<code>*</code>或具体的源</p><p><strong>为了避免后续的麻烦，强烈推荐响应具体的源</strong></p></blockquote>
	  <p>假设服务器做出了以下的响应：</p><pre><code>HTTP/1.1 200 OK
	  Date: Tue, 21 Apr 2020 08:03:35 GMT
	  ...
	  Access-Control-Allow-Origin: http://my.com
	  ...
	  
	  消息体中的数据</code></pre><p>当浏览器看到服务器允许自己访问后，高兴的像一个两百斤的孩子，于是，它就把响应顺利的交给js，以完成后续的操作</p><p>下图简述了整个交互过程</p><figure class="markdown-image">
			
			<img style="width:auto" src="http://mdrs.yuanjin.tech/img/image-20200421162846480.png" title="image-20200421162846480" alt="image-20200421162846480">
			<figcaption>image-20200421162846480</figcaption>
		
		  </figure><h1 id="article-md-title-5">需要预检的请求</h1><p>简单的请求对服务器的威胁不大，所以允许使用上述的简单交互即可完成。</p><p>但是，如果浏览器不认为这是一种简单请求，就会按照下面的流程进行：</p><ol>
	  <li><strong>浏览器发送预检请求，询问服务器是否允许</strong></li>
	  <li><strong>服务器允许</strong></li>
	  <li><strong>浏览器发送真实请求</strong></li>
	  <li><strong>服务器完成真实的响应</strong></li>
	  </ol>
	  <p>比如，在页面<code>http://my.com/index.html</code>中有以下代码造成了跨域</p><pre><code class="language-js"><span class="hljs-comment">// 需要预检的请求</span>
	  fetch(<span class="hljs-string">"http://crossdomain.com/api/user"</span>, {
		<span class="hljs-attr">method</span>:<span class="hljs-string">"POST"</span>, <span class="hljs-comment">// post 请求</span>
		<span class="hljs-attr">headers</span>:{  <span class="hljs-comment">// 设置请求头</span>
		  <span class="hljs-attr">a</span>: <span class="hljs-number">1</span>,
		  <span class="hljs-attr">b</span>: <span class="hljs-number">2</span>,
		  <span class="hljs-string">"content-type"</span>: <span class="hljs-string">"application/json"</span>
		},
		<span class="hljs-attr">body</span>: <span class="hljs-built_in">JSON</span>.stringify({ <span class="hljs-attr">name</span>: <span class="hljs-string">"袁小进"</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">18</span> }) <span class="hljs-comment">// 设置请求体</span>
	  });</code></pre>
	  <p>浏览器发现它不是一个简单请求，则会按照下面的流程与服务器交互</p><ol>
	  <li><strong>浏览器发送预检请求，询问服务器是否允许</strong></li>
	  </ol>
	  <pre><code>OPTIONS /api/user HTTP/1.1
	  Host: crossdomain.com
	  ...
	  Origin: http://my.com
	  Access-Control-Request-Method: POST
	  Access-Control-Request-Headers: a, b, content-type</code></pre><p>可以看出，这并非我们想要发出的真实请求，请求中不包含我们的响应头，也没有消息体。</p><p>这是一个预检请求，它的目的是询问服务器，是否允许后续的真实请求。</p><p>预检请求<strong>没有请求体</strong>，它包含了后续真实请求要做的事情</p><p>预检请求有以下特征：</p><ul>
	  <li>请求方法为<code>OPTIONS</code></li>
	  <li>没有请求体</li>
	  <li>请求头中包含<ul>
	  <li><code>Origin</code>：请求的源，和简单请求的含义一致</li>
	  <li><code>Access-Control-Request-Method</code>：后续的真实请求将使用的请求方法</li>
	  <li><code>Access-Control-Request-Headers</code>：后续的真实请求会改动的请求头</li>
	  </ul>
	  </li>
	  </ul>
	  <ol start="2">
	  <li><strong>服务器允许</strong></li>
	  </ol>
	  <p>服务器收到预检请求后，可以检查预检请求中包含的信息，如果允许这样的请求，需要响应下面的消息格式</p><pre><code>HTTP/1.1 200 OK
	  Date: Tue, 21 Apr 2020 08:03:35 GMT
	  ...
	  Access-Control-Allow-Origin: http://my.com
	  Access-Control-Allow-Methods: POST
	  Access-Control-Allow-Headers: a, b, content-type
	  Access-Control-Max-Age: 86400
	  ...</code></pre><p>对于预检请求，不需要响应任何的消息体，只需要在响应头中添加：</p><ul>
	  <li><code>Access-Control-Allow-Origin</code>：和简单请求一样，表示允许的源</li>
	  <li><code>Access-Control-Allow-Methods</code>：表示允许的后续真实的请求方法</li>
	  <li><code>Access-Control-Allow-Headers</code>：表示允许改动的请求头</li>
	  <li><code>Access-Control-Max-Age</code>：告诉浏览器，多少秒内，对于同样的请求源、方法、头，都不需要再发送预检请求了</li>
	  </ul>
	  <ol start="3">
	  <li><strong>浏览器发送真实请求</strong></li>
	  </ol>
	  <p>预检被服务器允许后，浏览器就会发送真实请求了，上面的代码会发生下面的请求数据</p><pre><code>POST /api/user HTTP/1.1
	  Host: crossdomain.com
	  Connection: keep-alive
	  ...
	  Referer: http://my.com/index.html
	  Origin: http://my.com
	  
	  {"name": "袁小进", "age": 18 }</code></pre><ol start="4">
	  <li><strong>服务器响应真实请求</strong></li>
	  </ol>
	  <pre><code>HTTP/1.1 200 OK
	  Date: Tue, 21 Apr 2020 08:03:35 GMT
	  ...
	  Access-Control-Allow-Origin: http://my.com
	  ...
	  
	  添加用户成功</code></pre><p>可以看出，当完成预检之后，后续的处理与简单请求相同</p><p>下图简述了整个交互过程</p><figure class="markdown-image">
			
			<img style="width:auto" src="http://mdrs.yuanjin.tech/img/image-20200421165913320.png" title="image-20200421165913320" alt="image-20200421165913320">
			<figcaption>image-20200421165913320</figcaption>
		
		  </figure><h1 id="article-md-title-6">附带身份凭证的请求</h1><p>默认情况下，ajax的跨域请求并不会附带cookie，这样一来，某些需要权限的操作就无法进行</p><p>不过可以通过简单的配置就可以实现附带cookie</p><pre><code class="language-js"><span class="hljs-comment">// xhr</span>
	  <span class="hljs-keyword">var</span> xhr = <span class="hljs-keyword">new</span> XMLHttpRequest();
	  xhr.withCredentials = <span class="hljs-literal">true</span>;
	  
	  <span class="hljs-comment">// fetch api</span>

	  fetch(url, {
		<span class="hljs-attr">credentials</span>: <span class="hljs-string">"include"</span>
	  })</code></pre>
	  <p>这样一来，该跨域的ajax请求就是一个<em>附带身份凭证的请求</em></p><p>当一个请求需要附带cookie时，无论它是简单请求，还是预检请求，都会在请求头中添加<code>cookie</code>字段</p><p>而服务器响应时，需要明确告知客户端：服务器允许这样的凭据</p><p>告知的方式也非常的简单，
	  只需要在响应头中添加：<code>Access-Control-Allow-Credentials: true</code>即可</p><p>对于一个附带身份凭证的请求，
	  若服务器没有明确告知，浏览器仍然视为跨域被拒绝。</p><p>另外要特别注意的是：
	  <strong>对于附带身份凭证的请求，服务器不得设置 <code>Access-Control-Allow-Origin 
	  的值为*</code></strong>。这就是为什么不推荐使用*的原因</p><h1 id="article-md-title-7">
	  一个额外的补充</h1><p>在跨域访问时，JS只能拿到一些最基本的响应头，如：Cache-Control、Content-Language、
	  Content-Type、Expires、Last-Modified、Pragma，如果要访问其他头，则需要服务器设置本响应头。
	  </p><p><code>Access-Control-Expose-Headers</code>头让服务器把允许浏览器访问的头放入白名单，
	  例如：</p><pre><code>Access-Control-Expose-Headers: authorization, a, b</code></pre><p>这样JS就能够访问指定的响应头了。</p>`

const htmlContent2 = `
<h2>布局</h2>
<p><img src="http://mdrs.yuanjin.tech/img/20210511102802.png" alt="image-20210511102549096"></p>
<p><strong>浮动</strong>：做文字环绕效果</p>
<p><strong>弹性盒</strong>：单行或单列布局</p>
<p><strong>网格</strong>：多行多列布局</p>
<h2>弹性盒</h2>
<blockquote>
<p>详细文档见<a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout">MDN</a></p>
<p><a href="https://flexboxfroggy.com/">弹性盒小游戏</a></p>
</blockquote>
<h3>生成弹性容器和弹性项目</h3>
<p><img src="http://mdrs.yuanjin.tech/img/20210511112624.png" alt="image-20210511112624876"></p>
<p>**默认情况下，**弹性项目沿着主轴依次排列，侧轴拉伸</p>
<h3>更改方向</h3>
<p>通过<code>flex-direction</code>可更改主轴方向</p>
<p><img src="http://mdrs.yuanjin.tech/img/20210511112510.png" alt="image-20210511112510632"></p>
<h3>主轴排列</h3>
<p>通过<code>justify-content</code>属性，可以影响主轴的排列方式</p>
<p><img src="http://mdrs.yuanjin.tech/img/20210511113617.png" alt="image-20210511113617325"></p>
<h3>侧轴排列</h3>
<p>通过<code>align-items</code>属性，可以影响侧轴的排列方式</p>
<p><img src="http://mdrs.yuanjin.tech/img/20210511114016.png" alt="image-20210511114016304"></p>
<h3>弹性项目伸缩</h3>
<p>所谓伸缩，是指在<strong>主轴方向</strong>上，当<strong>弹性容器</strong>有<strong>额外空间</strong>时，是否需要拉伸，当<strong>空间不足</strong>时
，是否需要<strong>压缩</strong></p>
<p>在<strong>弹性项目</strong>上使用<code>flex</code>属性，可设置拉伸和压缩比例：<code>flex: 拉伸比例 压缩比例 初始尺寸</code></p>
<p>拉伸示例：</p>
<p><img src="http://mdrs.yuanjin.tech/img/20210511120916.png" alt="image-20210511120916571"></p>
<p>压缩示例：</p>
<p><img src="http://mdrs.yuanjin.tech/img/20210511121459.png" alt="image-20210511121459341"></p>
<p>默认情况下，<code>flex: 0 1 auto</code></p>
<h3>主轴换行</h3>
<p>默认情况，当主轴剩余空间不足时，按照压缩比例进行压缩，但如果设置了主轴换行，则不会压缩，直接换行显示</p>
<p>给<strong>弹性容器</strong>设置<code>flex-wrap: wrap</code>，即可主轴换行</p>
<img src="http://mdrs.yuanjin.tech/img/20210511123310.png" alt="image-20210511123310673" style="zoom:50%;" />
<blockquote>
<p>尽管如此，多行多列仍然推荐使用网格布局</p>
</blockquote>
<h2>网格</h2>
<blockquote>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout">MDN详细文档</a></p>
<p><a href="http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html">阮一峰网格布局教程</a></p>
<p><a href="https://cssgridgarden.com/">网格布局小游戏</a></p>
</blockquote>
<p><strong>网格布局是多行多列布局的终极解决方案</strong></p>
<h3>生成网格布局</h3>
<img src="http://mdrs.yuanjin.tech/img/20210511165317.png" alt="image-20210511165317363" style="zoom:50%;" />
<p>容器生成网格布局后，其所有子元素为<strong>网格项目</strong></p>
<h3>定义行和列</h3>
<p><code>grid-template-rows</code>：定义行</p>
<p><code>grid-template-columns</code>：定义列</p>
<p><strong>它们的语法是相同的</strong></p>
<p><img src="http://mdrs.yuanjin.tech/img/20210511172305.png" alt="image-20210511172305100"></p>
<h3>改变排列方向</h3>
<p>使用属性<code>grid-auto-flow: column</code>，可使子元素按列排放</p>
<img src="http://mdrs.yuanjin.tech/img/20210511173447.png" alt="image-20210511173447321" style="zoom:50%;" />
<h3>单元格之间的间隙</h3>
<pre><code class="language-css">row-gap: 10px; /* 行间隙为10px */
column-gap: 20px; /* 列间隙为20px */
gap: 10px 20px; /* 行间隙为10px，列间隙为20px */
</code></pre>
<p><img src="http://mdrs.yuanjin.tech/img/20210512132025.png" alt="image-20210512132025687"></p>
<h3>单元格内部的对齐</h3>
<p>默认情况下，网格项目在单元格内部水平和垂直拉伸，以撑满单元格</p>
<p>可以使用属性<code>justify-items</code>设置<strong>水平方向</strong>的排列方式</p>
<p>可以使用属性<code>align-items</code>设置<strong>垂直方向</strong>的排列方式</p>
<p>它们的可取值是相同的：</p>
<pre><code class="language-css">justify-items: start 左 | end 右 | center 中 | stretch 拉伸;
align-items: start 上 | end 下 | center 中 | stretch 拉伸;
</code></pre>
<img src="http://mdrs.yuanjin.tech/img/20210511174450.png" alt="image-20210511174450356" style="zoom:50%;" />
<p>可以使用速写属性<code>place-items: 垂直对齐方式 水平对齐方式</code>同时设置这两个值</p>
<pre><code class="language-css">place-items: start center; /* 垂直靠上，水平居中 */
</code></pre>
<h3>网格项目定位</h3>
<p>默认情况下，网格项目依次排列到单元格中，每个网格占据一个单元格</p>
<p>但可以对网格项目设置<code>grid-area</code>属性来改变这一行为</p>
<p>使用方式为：</p>
<pre><code class="language-css">grid-area: 起始行线编号/起始列线编号/结束行线编号/结束列线编号;
</code></pre>
<img src="http://mdrs.yuanjin.tech/img/20210511180028.png" alt="image-20210511180027983" style="zoom:50%;" />
<h1>视觉</h1>
<blockquote>
<p>所谓视觉类样式，是指不影响盒子位置、尺寸的样式，例如文字颜色、背景颜色、背景图片等</p>
</blockquote>
<h2>阴影</h2>
<h3>盒子阴影</h3>
<blockquote>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow">MDN详细文档</a></p>
</blockquote>
<p>通过<code>box-shadow</code>属性可以设置整个盒子的阴影</p>
<p>下面是一些示例</p>
<iframe src="http://mdrs.yuanjin.tech/html/css-manual/box-shadow.html?v=2" style="height:900px;">
<h3>文字阴影</h3>
<blockquote>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-shadow">MDN详细文档</a></p>
</blockquote>
<p>通过<code>text-shadow</code>可以设置文字阴影</p>
<p>下面是一些示例</p>
<iframe src="http://mdrs.yuanjin.tech/html/css-manual/text-shadow.html?v=3" style="height:500px;">
<h2>圆角</h2>
<blockquote>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius">MDN详细文档</a></p>
</blockquote>
<p>通过设置<code>border-radius</code>，可以设置盒子的圆角</p>
<p><img src="http://mdrs.yuanjin.tech/img/20210512131026.png" alt="image-20210512131026084"></p>
<p><code>border-radius</code>可以有很多灵活的用法，将下面的代码依次粘贴到页面中测试一下</p>
<pre><code class="language-css">border-radius: 10px; /* 同时设置4个角的圆角，半径为10px */
border-radius: 50%; /* 同时设置4个角的圆角，圆的横向半径为宽度一半，纵向半径为高度一半 */
border-radius: 10px 20px 30px 40px; /* 分别设置左上、右上、右下、左下的圆角 */
</code></pre>
<iframe src="http://mdrs.yuanjin.tech/html/css-manual/border-raduis.html?v=5" style="height:550px;">
<h2>背景渐变</h2>
<blockquote>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient()">MDN详细文档</a></p>
</blockquote>
<p>在设置<strong>背景图片</strong>时，除了可以使用<code>url()</code>加载一张背景图，还可以使用<code>linear-gradient()</code>函数设置背景渐变</p>     
<p><code>linear-gradient()</code>用于创建一张渐变的图片，语法为：</p>
<pre><code class="language-css">/* 设置渐变背景，方向：从上到下，颜色：从#e66465渐变到#9198e5 */
background: linear-gradient(to bottom, #e66465, #9198e5);
</code></pre>
<p><img src="http://mdrs.yuanjin.tech/img/20210512135028.png" alt="image-20210512135024676"></p>
<h2>变形</h2>
<blockquote>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform">MDN详细文档</a></p>
</blockquote>
<p>通过<code>transform</code>属性，可以使盒子的形态发生变化</p>
<p>该属性支持多种变形方案，常见的有:</p>
<ul>
<li>translate，平移</li>
<li>scale，缩放</li>
<li>rotate，旋转</li>
</ul>
<p><strong>无论是哪一种transform，都只是视觉效果的变化，不会影响盒子的布局</strong></p>
<p><strong>transform不会导致浏览器reflow和rerender，因此效率极高</strong></p>
<h3>translate 平移</h3>
<p>使用<code>translate</code>可以让盒子在原来位置上产生位移，类似于相对定位</p>
<p><img src="http://mdrs.yuanjin.tech/img/20210512140643.png" alt="image-20210512140622630"></p>
<h3>scale 缩放</h3>
<p>使用<code>translate</code>可以让盒子在基于原来的尺寸发生缩放</p>
<p><img src="http://mdrs.yuanjin.tech/img/20210512141500.png" alt="image-20210512141500499"></p>
<h3>rotate 旋转</h3>
<p>使用<code>rotate</code>属性可以在原图基础上进行旋转</p>
<pre><code class="language-css">/* 在原图的基础上，顺时针旋转45度角 */
transform: rotate(45deg);
/* 在原图的基础上，顺时针旋转半圈 */
transform: rotate(0.5turn);
</code></pre>
<p>可以点击下面的按钮试一下旋转效果</p>
<iframe src="http://mdrs.yuanjin.tech/html/css-manual/rotate.html" style="height:400px;">
<h3>改变变形原点</h3>
<blockquote>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-origin">MDN详细文档</a></p>
</blockquote>
<p>变形原点的位置，会影响到具体的变形行为</p>
<p>默认情况下，变形的原点在盒子中心，你可以通过<code>transform-origin</code>来改变它</p>
<pre><code class="language-css">transform-origin: center; /* 设置原点在盒子中心 */
transform-origin: left top; /* 设置原点在盒子左上角 */
transform-origin: right bottom; /* 设置原点在盒子右下角 */
transform-origin: 30px 60px; /* 设置原点在盒子坐标 (30, 60) 位置 */
</code></pre>
<p>试一试，先点击设置原点的按钮来设置原点(已在图片中使用红色小点标记)，然后点击变形按钮进行变形</p>
<iframe src="http://mdrs.yuanjin.tech/html/css-manual/transform-origin.html?v2" style="height:600px;">
<h3>多种变形叠加</h3>
<p>可以一次性设置多种变形效果</p>
<pre><code class="language-css">/* 先旋转45度，再平移(100,100) */
transform: rotate(45deg) translate(100px, 100px);
/* 先平移(100, 100)，再旋转45度 */
transform: translate(100px, 100px) rotate(45deg);
</code></pre>
<p>注意：旋转会导致坐标系也跟着旋转，从而可能影响到后续的变形效果</p>
<p>下面的例子可以很好的说明这一点</p>
<p>http://mdrs.yuanjin.tech/html/css-manual/multi-transform.html</p>
<blockquote>
<p>本来打算把这个效果嵌入到markdown，但由于嵌入后出现一些未知的bug，因此只能粘贴效果地址了</p>
</blockquote>
<h1>过渡和动画</h1>
<p>使用过渡和动画，可以让css属性变化更加丝滑</p>
<p><strong>过渡和动画无法对所有的CSS属性产生影响，能够产生影响的只有数值类属性</strong>，例如：颜色、宽高、字体大小等等</p>
<h2>过渡</h2>
<blockquote>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition">MDN详细文档</a></p>
</blockquote>
<pre><code class="language-css">transition: 过渡属性 持续时间 过渡函数 过渡延迟
</code></pre>
<ul>
<li>
<p><strong>过渡属性</strong></p>
<p>针对哪个css属性应用过渡。例如填写<code>transform</code>，则表示仅针对<strong>transform</strong>属性应用过渡。</p>
<p>若填写<code>all</code>或不填写，则表示针对所有css属性都应用过渡</p>
</li>
<li>
<p><strong>持续时间</strong></p>
<p>css属性变化所持续的时间，需要带上单位。例如<code>3s</code>表示3秒，<code>0.5s</code>或<code>500ms</code>均表示500毫秒</p>
</li>
<li>
<p><strong>过渡函数</strong></p>
<p>本质是css属性变化的贝塞尔曲线函数，通常直接使用预设值：</p>
<p><code>ease-in-out</code>：平滑开始，平滑结束</p>
<p><code>linear</code>：线性变化</p>
<p><code>ease-in</code>：仅平滑开始</p>
<p><code>ease-out</code>：仅平滑结束</p>
</li>
<li>
<p><strong>过渡延迟</strong></p>
<p>书写规则和持续时间一样，表示过渡效果延迟多久后触发，不填则无延迟</p>
</li>
</ul>
<p><strong>在JS中，可以监听元素的<code>transitionstart</code>和<code>transitionend</code>事件，从而在过渡开始和过渡结束时做一些别的事情</strong></p> 
<h2>动画</h2>
<blockquote>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations">MDN详细文档</a></p>
</blockquote>
<p><strong>动画的本质是预先定义的一套css变化规则，然后给该规则取个名字</strong></p>
<p><img src="http://mdrs.yuanjin.tech/img/20210513172902.png" alt="image-20210513172902413"></p>
<p>然后，其他元素即可使用这样的规则：</p>
<pre><code class="language-css">animation: 规则名 持续时间;
</code></pre>
<p>在应用规则时，还可以指定更多的信息</p>
<pre><code class="language-css">animation: 规则名 持续时间 重复次数 时间函数 动画方向 延迟时间
</code></pre>
<p>一些细节：</p>
<ul>
<li>定义规则时，<code>0%</code>可以书写为<code>from</code></li>
<li>定义规则时，<code>100%</code>可以书写为<code>to</code></li>
<li>重复次数为<code>infinite</code>时，表示无限重复</li>
<li>动画方向为<code>alternate</code>时，表示交替反向，第1次正向，第2次反向，第3次正向，第4次方向，以此类推</li>
</ul>
<p><strong>在JS中，可以监听元素的<code>animationstart</code>和<code>animationnend</code>事件，从而在过渡开始和过渡结束时做一些别的事情</strong></p>  
<h1>其他</h1>
<h2>box-sizing</h2>
<p>一图胜千言</p>
<p><img src="http://mdrs.yuanjin.tech/img/20210514150015.png" alt="image-20210514150015660"></p>
<p>使用<code>border-box</code>控制尺寸更加直观，因此，很多网站都会加入下面的代码</p>
<pre><code class="language-css">* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</code></pre>
<h2>字体图标</h2>
<blockquote>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face">MDN font-face 指令</a></p>
</blockquote>
<p>css3新增了<code>font-face</code>指令，该指令可以让我们加载网络字体</p>
<p>其最常见的应用就是字体图标</p>
<p><strong>字体图标本质上是文字，即通过<code>color</code>设置颜色，通过<code>font-size</code>设置尺寸</strong></p>
<p>国内使用最多的字体图标平台是<a href="https://www.iconfont.cn/">阿里巴巴矢量图标库</a></p>
<p>登录平台后即可免费使用其所有字体图标</p>
<h2>图像内容适应</h2>
<blockquote>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit">MDN详细文档</a></p>
</blockquote>
<p>css3属性<code>object-fit</code>可以控制<strong>多媒体内容和与元素</strong>的适应方式，通常应用在<code>img</code>或<code>video</code>元素中</p>    
<p>一图胜千言</p>
<p>下图中的所有<code>img</code>元素均被固定了宽高，溢出img的部分实际上均不会显示</p>
<p><img src="http://mdrs.yuanjin.tech/img/20210514134908.png" alt="image-20210514134908778"></p>
<h2>视口单位</h2>
<p>css3支持使用<code>vw</code>和<code>vh</code>作为单位，分别表示<code>视口宽度</code>和<code>视口高度</code></p>
<p>例如<code>1vh</code>表示视口高度的<code>1%</code>，<code>100vw</code>表示视口宽度的<code>100%</code></p>
<h2>伪元素选择器</h2>
<p>通过<code>::before</code>和<code>::after</code>选择器，可以通过css给元素生成两个子元素</p>
<img src="http://mdrs.yuanjin.tech/img/20210514140049.png" alt="image-20210514140049244" style="zoom:50%;" />
<p>使用伪元素可以避免在HTML中使用过多的空元素</p>
<p><strong>伪元素必须要有<code>content</code>属性，否则不能生效，如果不需要有元素内容，设置<code>content:''</code></strong></p>
<h2>平滑滚动</h2>
<blockquote>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-behavior">MDN详细文档</a></p>
</blockquote>
<p>使用<code>scroll-behavior: smooth</code>，可以让滚动更加丝滑</p>
<p>参见MDN效果即可</p>`
export { htmlContent, htmlContent2 }
