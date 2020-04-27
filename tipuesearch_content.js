var tipuesearch = {"pages":[{"title":"About Me","text":"My name is Kieran McAuley. I work as a medical physicist for Saint Lukes Radiation Oncology Network . Possessing a strong research background covering a broad range of radiation therapy physics, diagnostic medical imaging, radiation protection, risk management and nuclear medicine. Preceded by a first class honors undergraduate qualification in Experimental Physics, with experience in computational optics/physics using python and C++. This blog is to document a number of interesting uses of python based programming in the area of radiation physics. For further information on similar projects visit PyMedPhys .","tags":"pages","url":"/pages/about-me/","loc":"/pages/about-me/"},{"title":"Image Analysis","text":"Image Analysis using scipy and scikit-image In this post, I examine the use of scipy and scikit-image for use in image analysis with a focus on its application to scientific data. Images as numpy arrays Images are represented in scikit-image using standard numpy arrays. This allows maximum inter-operability with other python libraries such as, matplotlib and scipy . A standard color image is just a 3D array, where the last dimension has a size of 3 and contains information on the images red, green and blue channels (RGB). The following example uses a sample image from the sckit-image module to demonstrate the attributes of an image array. ::: python3 # loading standard libraries import numpy as np from matplotlib import pyplot as plt from skimage import data cat = data . chelsea () # obtain the image dimensions print ( \"Shape:\" , cat . shape ) #obtaining the maximum array values print ( \"Values min/max:\" , cat . min (), cat . max ()) # in python we can manipulate the values of the image arrays # here a square portion is defined using the row and column co-ordinates of the image # and the channel data is replaced with the darkest red shade available # while setting the green and blue values to zero cat [ 10 : 110 , 10 : 110 , :] = [ 255 , 0 , 0 ] # [red, green, blue] # show the image array plt . imshow ( cat ); The output of this code describes: The shape of the 3D array we can inspect the number of rows and columns, as well as the number of color channels. Some image formats can contain additional channel filter data i.e. infrared, etc. Shape: (300, 451, 3) There exist different conventions for representing image values, the most common are: Float64 : where 0 is black, 255 is white (0-255) uint8 : where 0 is black, 1 is white (0-1) Scipy allows any data-type as input, as long as the range is correct ( 0-1 for floating point images, 0-255 for unsigned bytes, 0-65535 for unsigned 16-bit integers). The range of values contained in this image were found to be: Values min/max: (0, 231) It is clear this image was input as an float64 data type,this could be easily converted if required. The resulting plot is displayed below: Separation of color channels Using another sample image the separation of color data can be performed quite simply, this may be useful in assessing the different channels of irradiated film using python. image = plt . imread ( '../images/Bells-Beach.jpg' ) # each color channel assigned to a different variable r = image [:, :, 0 ] # 0 channel is red # ... operator in array grabs all values until final array dimension g = image [ ... , 1 ] # 1 is green b = image [ ... , 2 ] # 2 is blue # plotting the image and r, g, b channels # setting figure size f , axes = plt . subplots ( 1 , 4 , figsize = ( 16 , 5 )) for ax in axes : ax . axis ( 'off' ) ( ax_r , ax_g , ax_b , ax_color ) = axes # set image to grey scale to view color dependency ax_r . imshow ( r , cmap = 'gray' ) ax_r . set_title ( 'red channel' ) ax_g . imshow ( g , cmap = 'gray' ) ax_g . set_title ( 'green channel' ) ax_b . imshow ( b , cmap = 'gray' ) ax_b . set_title ( 'blue channel' ) # stack the R, G, and B layers using a numpy attribute ax_color . imshow ( np . stack ([ r , g , b ], axis = 2 )) ax_color . set_title ( 'all channels' ); The resulting plots are displayed below: The lighter the areas in the individual images represent areas with the highest value for the corresponding channel. For example, the sea in the blue channel is quite bright as it holds a large portion of the information for that section. Where as the bushes are quite dark due to the values being contained in mainly the green channel. Segmentation of images Segmentation deals with separating the image into regions of interest. Segmentation contains two major sub-fields: Supervised segmentation : Some prior knowledge, possibly from human input, is used to guide the algorithm. Unsupervised segmentation : No prior knowledge. These algorithms attempt to subdivide into meaningful regions automatically. The user may be able to tweak settings like number of regions. The simplest method would be thresholding, which will be examined in this section. import numpy as np import matplotlib.pyplot as plt # importing relevant packages import skimage.data as data import skimage.segmentation as seg from skimage import filters from skimage import draw from skimage import color from skimage import exposure # useful function when plotting multiple figures def image_show ( image , nrows = 1 , ncols = 1 , cmap = 'gray' , ** kwargs ): fig , ax = plt . subplots ( nrows = nrows , ncols = ncols , figsize = ( 16 , 16 )) ax . imshow ( image , cmap = 'gray' ) ax . axis ( 'off' ) return fig , ax # loading sample image text = data . page () image_show ( text ); The values of the array can be unraveled to generate a histogram of the individual pixel values. If the image was exposed correctly the distribution may be bimodal allowing us to simply cut-off the lower values. However, this is usually not the case. Using supervised segmentation, we could set a cut-off value. This would require trial and error, therefore, a supervised method can be more beneficial. In this case the sauvola filter was applied which attempts to set an ideal threshold for every pixel. After examining multiple cut-off values the best supervised thresholding set at 100 produced the following figure: Clearly there is room for improvement. By using the sauvola filter in sckit-image package, the following image was obtained. The choice of an appropriate filter had a substantial impact on the information retained in this image in comparison to the supervised method. Conclusions python can be used as a powerful tool in the anaylsis of images, in particular with the inclusion of the filters and attributes in the scipy and sckit-image modules.","tags":"blogging","url":"/articles/2020/04/20/image-analysis/","loc":"/articles/2020/04/20/image-analysis/"},{"title":"Data Analysis with pandas","text":"Introduction to Data Analysis with pandas To become familiarised with the pandas library for use in analysis of data I undertook this small project. As most data seen clinically from previous reports and new dose monitoring software will collate data in a .csv or .dat file, I examined methods of pulling this data to python utilising pandas. Formatting data Data obtained from the Met Office Hadley Centre Central England Temperature Data reserve (1772-present), available at Met Office downloads , was used in this analysis. import pandas as pd from pandas import Series import matplotlib.pyplot as plt df = pd . read_csv ( \"C:/Users/Kieran/Pandas tutorial/cetml1659on.dat\" , skiprows = 4 , #only numerical data remains delim_whitespace = True , # whitespace separated sep='\\s+' # unrecorded years use variation of -99 as placeholder # must be removed # df[df < -50] = None (alternative method) na_values = [ '-99.9' , '-99.99' ] ) df . tail () #display end of dataset By examining the average temperature ( \\(&#94;\\circ\\) C) of each year, the following plot was obtained: While this data does show an obvious increase in the average temperature ( \\(&#94;\\circ\\) C) by year, a clearer result could be obtained by grouping the data. Groupby module String manipulation was performed to generate a new column titled 'decade'. Using the groupby module, the mean temperature of each decade was obtained. years = Series ( df . index , index = df . index ) . apply ( str ) decade = years . apply ( lambda x : x [: 3 ] + '0' ) df [ 'decade' ] = decade by_decade = df . groupby ( 'decade' ) . mean () Plotting the average temperatures by decade produces the following figure: The results obtained by grouping the data by decade have become considerably clearer. The manipulation of the data was also quite minimal. Annotation module As annotation within python can become complex, the year plot was used to test certain aspects of annotating figures. The plots of January and June average temperatures by year were included. The aim was to annotate the year which contained the January with highest average temperature (\"Warmest Winter\"). fig , ax = plt . subplots () #plotting various average annual and monthly temps year_plot = df [ 'JAN' ] . plot ( color = \"steelblue\" , ax = ax ) year_plot = df [ 'JUN' ] . plot ( color = \"firebrick\" , ax = ax ) year_plot = df [ 'YEAR' ] . plot ( color = \"green\" , linestyle = \"--\" , ax = ax ) year_plot . set_ylabel ( r \"Average Temperature ($&#94;\\circ$C)\" ) year_plot . set_xlabel ( \"Year\" ) ax . legend ( loc = 'upper left' ) year_plot . grid ( color = 'black' , linestyle = '-' , linewidth = 0.25 ) #LaTex required for use of symbols year_plot . set_title ( r \"Average Temperature ($&#94;\\circ$C) vs. Year\" ) # Return index of first occurrence of maximum over requested axis warm_winter_year = df [ 'JAN' ] . idxmax () warm_winter_temp = df [ 'JAN' ] . max () ax . annotate ( 'Warmest winter' , xy = ( warm_winter_year , warm_winter_temp ), xycoords = 'data' , xytext = ( - 100 , + 30 ), textcoords = 'offset points' , fontsize = 12 , arrowprops = dict ( arrowstyle = \"->\" , connectionstyle = \"arc3,rad=-.2\" )) plt . show () This considerable block of code produced the annotated figure displayed below: Conclusions The above data all appear to show a local increase of the average temperatures by year and decade. This would be expected, as we know there is a global increase in the average temperatures observed worldwide. The use of python in selection and manipulation in this data analysis was quite simple and removed the need for manual manipulation of data compared to another available software. Although the annotation module commonly used to annotate figures can be difficult to implement and may produce large blocks of code, the results are markedly better than what can be achieved in programs such as Excel . Future work to improve this analysis should examine areas such as error analysis with python and further annotation examples. if (!document.getElementById('mathjaxscript_pelican_#%@#$@#')) { var align = \"center\", indent = \"0em\", linebreak = \"false\"; if (false) { align = (screen.width < 768) ? \"left\" : align; indent = (screen.width < 768) ? \"0em\" : indent; linebreak = (screen.width < 768) ? 'true' : linebreak; } var mathjaxscript = document.createElement('script'); mathjaxscript.id = 'mathjaxscript_pelican_#%@#$@#'; mathjaxscript.type = 'text/javascript'; mathjaxscript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/latest.js?config=TeX-AMS-MML_HTMLorMML'; var configscript = document.createElement('script'); configscript.type = 'text/x-mathjax-config'; configscript[(window.opera ? \"innerHTML\" : \"text\")] = \"MathJax.Hub.Config({\" + \" config: ['MMLorHTML.js'],\" + \" TeX: { extensions: ['AMSmath.js','AMSsymbols.js','noErrors.js','noUndefined.js'], equationNumbers: { autoNumber: 'none' } },\" + \" jax: ['input/TeX','input/MathML','output/HTML-CSS'],\" + \" extensions: ['tex2jax.js','mml2jax.js','MathMenu.js','MathZoom.js'],\" + \" displayAlign: '\"+ align +\"',\" + \" displayIndent: '\"+ indent +\"',\" + \" showMathMenu: true,\" + \" messageStyle: 'normal',\" + \" tex2jax: { \" + \" inlineMath: [ ['\\\\\\\\(','\\\\\\\\)'] ], \" + \" displayMath: [ ['$$','$$'] ],\" + \" processEscapes: true,\" + \" preview: 'TeX',\" + \" }, \" + \" 'HTML-CSS': { \" + \" availableFonts: ['STIX', 'TeX'],\" + \" preferredFont: 'STIX',\" + \" styles: { '.MathJax_Display, .MathJax .mo, .MathJax .mi, .MathJax .mn': {color: 'inherit ! important'} },\" + \" linebreaks: { automatic: \"+ linebreak +\", width: '90% container' },\" + \" }, \" + \"}); \" + \"if ('default' !== 'default') {\" + \"MathJax.Hub.Register.StartupHook('HTML-CSS Jax Ready',function () {\" + \"var VARIANT = MathJax.OutputJax['HTML-CSS'].FONTDATA.VARIANT;\" + \"VARIANT['normal'].fonts.unshift('MathJax_default');\" + \"VARIANT['bold'].fonts.unshift('MathJax_default-bold');\" + \"VARIANT['italic'].fonts.unshift('MathJax_default-italic');\" + \"VARIANT['-tex-mathit'].fonts.unshift('MathJax_default-italic');\" + \"});\" + \"MathJax.Hub.Register.StartupHook('SVG Jax Ready',function () {\" + \"var VARIANT = MathJax.OutputJax.SVG.FONTDATA.VARIANT;\" + \"VARIANT['normal'].fonts.unshift('MathJax_default');\" + \"VARIANT['bold'].fonts.unshift('MathJax_default-bold');\" + \"VARIANT['italic'].fonts.unshift('MathJax_default-italic');\" + \"VARIANT['-tex-mathit'].fonts.unshift('MathJax_default-italic');\" + \"});\" + \"}\"; (document.body || document.getElementsByTagName('head')[0]).appendChild(configscript); (document.body || document.getElementsByTagName('head')[0]).appendChild(mathjaxscript); }","tags":"blogging","url":"/articles/2020/04/14/data-analysis-with-pandas/","loc":"/articles/2020/04/14/data-analysis-with-pandas/"},{"title":"First Post","text":"Jupyter Notebook example This is a previously written python code in a jupyter notebook to test its implementation on the site. In [2]: \"\"\" Created on Fri Nov 25 19:23:20 2016 @author: Kieran \"\"\" import numpy as np import matplotlib.pyplot as plt import matplotlib.animation as animation N = 100 ON = 255 OFF = 0 vals = [ ON , OFF ] # populate grid with random on/off - more off than on grid = np . random . choice ( vals , N * N , p = [ 0.2 , 0.8 ]) . reshape ( N , N ) def update ( data ): global grid # copy grid since we require 8 neighbors for calculation # and we go line by line newGrid = grid . copy () for i in range ( N ): for j in range ( N ): # compute 8-neghbor sum # using toroidal boundary conditions - x and y wrap around # so that the simulaton takes place on a toroidal surface. total = ( grid [ i , ( j - 1 ) % N ] + grid [ i , ( j + 1 ) % N ] + grid [( i - 1 ) % N , j ] + grid [( i + 1 ) % N , j ] + grid [( i - 1 ) % N , ( j - 1 ) % N ] + grid [( i - 1 ) % N , ( j + 1 ) % N ] + grid [( i + 1 ) % N , ( j - 1 ) % N ] + grid [( i + 1 ) % N , ( j + 1 ) % N ]) / 255 # apply Conway's rules if grid [ i , j ] == ON : if ( total < 2 ) or ( total > 3 ): newGrid [ i , j ] = OFF else : if total == 3 : newGrid [ i , j ] = ON # update data mat . set_data ( newGrid ) grid = newGrid return [ mat ] # set up animation fig , ax = plt . subplots () mat = ax . matshow ( grid ) ani = animation . FuncAnimation ( fig , update , interval = 50 , save_count = 50 ) plt . show () *{stroke-linecap:butt;stroke-linejoin:round;}","tags":"portfolio post","url":"/articles/2020/04/06/first-post/","loc":"/articles/2020/04/06/first-post/"}]};