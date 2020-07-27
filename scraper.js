//web scraper for losant marketing site
var config = require('./config');
var algoliasearch = require('algoliasearch');
const client = algoliasearch(config.ALGOLIA.APP_ID, config.ALGOLIA.API_KEY);
const index = client.initIndex('dev_MarketingSite');
const puppeteer = require ('puppeteer');
const fs = require('fs');

(async () => {
    try{
        const browser = await puppeteer.launch({headless: true});  
       
        const page = await browser.newPage();

        await page.goto('https://www.losant.com/');
        await page.waitForSelector('.footer-menus');
            
        const menuItems = await page.$$('.footer-menus .hs-menu-depth-2');

        for (let i = 0; i < menuItems.length; i++) {
            await page.goto('https://www.losant.com/');
            await page.waitForSelector('.footer-menus');
            
            const menuItems = await page.$$('.footer-menus .hs-menu-depth-2');

            const section = menuItems[i];
            const button = await section.$('.hs-menu-depth-2 a');
            const buttonName = await page.evaluate(button => button.textContent, button);
            if ( buttonName == "Documentation" || buttonName == "Blog" || buttonName == "Forums" || buttonName == "Create an Account"){
            }else if( i == 0 ){
                const links = await page.evaluate(()=>{
                    const lists = [];

                    const headSource = Array.from(document.querySelectorAll('head'));
                    headSource.forEach(function(node){
                        const data = {
                            'url': node.querySelector('meta[property="og:url"]').getAttribute('content'),
                            'featureImage': node.querySelector('meta[property="og:image"]').getAttribute('content'),
                            'meta': node.querySelector('meta[property="og:description"]').getAttribute('content')
                        };
                        console.log(data);
                        lists.push(data);
                    }); 

                    const getNodesInnerText = (nodes)  => {
                        return Array.from(nodes).map(node => node.innerText);
                    }
                    
                    const node = Array.from(document.querySelectorAll('main'));
                    node.forEach(function(node){
                        const data = {
                            'title': node.querySelector('h1').innerText,
                            'headers': getNodesInnerText(document.querySelectorAll('h2')),
                            'subHeaders': getNodesInnerText(document.querySelectorAll('h3')),
                            'smallerHeaders': getNodesInnerText(document.querySelectorAll('h4')),
                            'bodyText': getNodesInnerText(document.querySelectorAll('p')),
                        };             
                        lists.push(data);
                    });
                    headSource.push(...node);
                    return lists;
                });

                console.log(links);

                try {
                    await index.clearObjects()
                    await index.saveObjects(links, {
                        autoGenerateObjectIDIfNotExist: true,
                    })
                    } catch (error) {
                    console.log(error)
                    }
            }else{
                button.click();
                await page.waitForNavigation();
                let links = await page.evaluate(()=>{
                    const lists = [];

                    const headSource = Array.from(document.querySelectorAll('head'));
                    headSource.forEach(function(node){
                        const data = {
                            'url': node.querySelector('meta[property="og:url"]').getAttribute('content'),
                            'featureImage': node.querySelector('meta[property="og:image"]').getAttribute('content'),
                            'meta': node.querySelector('meta[property="og:description"]').getAttribute('content')
                        };
                        lists.push(data);
                    }); 

                    const getNodesInnerText = (nodes)  => {
                        return Array.from(nodes).map(node => node.innerText);
                    }
                    
                    const node = Array.from(document.querySelectorAll('main'));
                    node.forEach(function(node){
                        const data = {
                            'title': node.querySelector('h1').innerText,
                            'headers': getNodesInnerText(document.querySelectorAll('h2')),
                            'subHeaders': getNodesInnerText(document.querySelectorAll('h3')),
                            'smallerHeaders': getNodesInnerText(document.querySelectorAll('h4')),
                            'bodyText': getNodesInnerText(document.querySelectorAll('p')),
                        };             
                        lists.push(data);
                    });
                    headSource.push(...node);
                    return lists;
                });

                console.log(links);

                try {
                    await index.saveObjects(links, {
                        autoGenerateObjectIDIfNotExist: true,
                    })
                } catch (error) {
                    console.log(error)
                }                
            } 
        }
        await browser.close();
    } catch (e) {
        console.log('our error', e);
    }
  }) ();

