var Solver=function(a,b,c){var d=this;d.tiles=a,d.nbOfTilesV=b,d.nbOfTilesH=c,d.nbOfTiles=b*c-1,d.blnkx=-1,d.blnky=-1,d.clips=[],d.sol=[],d.solve=function(){for(var a=0;a<d.tiles.length;a++)d.clips.push(d.tiles[a].clipIndex),d.tiles[a].hidden&&(d.blnkx=a%b,d.blnky=Math.floor(a/b));return d.nPuzzleSolver(),d.sol},d.nPuzzleSolver=function(){for(var a=new Array,b=0;b<=d.nbOfTiles;b++)a[b]=d.clips[b];a[d.nbOfTiles+1]=d.blnkx,a[d.nbOfTiles+2]=d.blnky;for(var c=0,e=0;e<d.nbOfTilesH-2;e++){for(var f=0;f<d.nbOfTilesV;f++)d.movepiece(c+f,e,f);c+=d.nbOfTilesV}for(f=0;f<d.nbOfTilesV-2;f++){if(d.movepiece(c,d.nbOfTilesH-2,f),d.blnkx==f&&d.push(3),d.clips[c+d.nbOfTilesV]!=c+d.nbOfTilesV){for(d.movepiece(c+d.nbOfTilesV,d.nbOfTilesH-1,f+1),d.blnky!=d.nbOfTilesH-1&&(d.blnkx==f+1&&d.push(3),d.push(2));d.blnkx>f+2;)d.push(0);d.push(0,0,1,3,2,3,1,0,0,2,3)}c++}d.blnkx<d.nbOfTilesV-1&&d.push(3),d.blnky<d.nbOfTilesH-1&&d.push(2),c=d.nbOfTiles-d.nbOfTilesV-1,d.clips[c]==c+1&&d.push(1,0,2,3),d.clips[c]==c+d.nbOfTilesV&&d.push(0,1,3,2);for(var b=0;b<=d.nbOfTiles;b++)d.clips[b]=a[b];d.blnkx=a[d.nbOfTiles+1],d.blnky=a[d.nbOfTiles+2]},d.movepiece=function(a,b,c){for(var e=-1,f=0;f<d.nbOfTilesH;f++){for(var g=0;g<d.nbOfTilesV&&(e++,d.clips[e]!=a);g++);if(d.clips[e]==a)break}for(c>g&&d.blnky==b&&d.push(2);g>c;){for(d.blnky==f&&d.blnkx>g&&(f==d.nbOfTilesH-1?d.push(1):d.push(2));d.blnkx>=g;)d.push(0);for(;d.blnkx<g-1;)d.push(3);for(;d.blnky<f;)d.push(2);for(;d.blnky>f;)d.push(1);d.push(3),g--}for(;c>g;){for(d.blnky==f&&d.blnkx<g&&(f==d.nbOfTilesH-1?d.push(1):d.push(2));d.blnkx<=g;)d.push(3);for(;d.blnkx>g+1;)d.push(0);for(;d.blnky<f;)d.push(2);for(;d.blnky>f;)d.push(1);d.push(0),g++}for(;f>b;){if(f-1>b){for(;d.blnky<f-1;)d.push(2);for(d.blnkx==g&&d.push(g==d.nbOfTilesV-1?0:3);d.blnky>f-1;)d.push(1);for(;d.blnkx<g;)d.push(3);for(;d.blnkx>g;)d.push(0);d.push(2)}else if(g!=d.nbOfTilesV-1){for(d.blnky==f&&d.push(2);d.blnkx<g+1;)d.push(3);for(;d.blnkx>g+1;)d.push(0);for(;d.blnky>f-1;)d.push(1);for(;d.blnky<f-1;)d.push(2);d.push(0,2)}else if(d.blnky<f&&d.blnkx==g)for(;d.blnky<f;)d.push(2);else{for(;d.blnky>f+1;)d.push(1);for(;d.blnky<f+1;)d.push(2);for(;d.blnkx<g;)d.push(3);for(;d.blnkx>g;)d.push(0);d.push(1,1,0,2,3,2,0,1,1,3,2)}f--}for(;b>f;){for(d.blnkx==g&&d.blnky<f&&(g==d.nbOfTilesV-1?d.push(0):d.push(3));d.blnky>f+1;)d.push(1);for(;d.blnky<f+1;)d.push(2);for(;d.blnkx<g;)d.push(3);for(;d.blnkx>g;)d.push(0);d.push(1),f++}},d.push=function(){for(var a=0;a<d.push.arguments.length;a++){var b=d.push.arguments[a];d.domove(b)}},d.domove=function(a){var b=d.blnkx+d.blnky*d.nbOfTilesV;0==a?(d.clips[b]=d.clips[b-1],d.clips[b-1]=d.nbOfTiles,d.blnkx--,d.sol.push(b-1)):1==a?(d.clips[b]=d.clips[b-d.nbOfTilesV],d.clips[b-d.nbOfTilesV]=d.nbOfTiles,d.blnky--,d.sol.push(b-d.nbOfTilesV)):2==a?b+d.nbOfTilesV<=d.nbOfTilesV*d.nbOfTilesH&&(d.clips[b]=d.clips[b+d.nbOfTilesV],d.clips[b+d.nbOfTilesV]=d.nbOfTiles,d.blnky++,d.sol.push(b+d.nbOfTilesV)):3==a&&(d.clips[b]=d.clips[b+1],d.clips[b+1]=d.nbOfTiles,d.blnkx++,d.sol.push(b+1))}};