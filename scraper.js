//web scraper for losant marketing site
var config = require('./config');
var algoliasearch = require('algoliasearch');
const client = algoliasearch(config.ALGOLIA.APP_ID, config.ALGOLIA.API_KEY);
const index = client.initIndex('dev_MarketingSite');
const puppeteer = require ('puppeteer');

index.setSettings({
    searchableAttributes: ['title', 'headers', 'subheaders', 'smallerHeaders', 'bodyText'],
    customRanking: ['asc(title, headers, subheaders, smallerHeaders, bodyText)'],
  });

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
                    const lists = {};

                    const headSource = document.querySelector('head');
                    lists.url = headSource.querySelector('meta[property="og:url"]').getAttribute('content');
                    lists.featureImage = headSource.querySelector('meta[property="og:image"]').getAttribute('content');
                    lists.meta = headSource.querySelector('meta[property="og:description"]').getAttribute('content');

                    const getNodesInnerText = (nodes)  => {
                        return Array.from(nodes).map(node => node.innerText
                        );
                    }

                    lists.title = document.querySelector('h1').innerText;
                    lists.headers = getNodesInnerText(document.querySelectorAll('h2')).join(" ");
                    lists.subHeaders = getNodesInnerText(document.querySelectorAll('h3')).join(" ");
                    lists.smallerHeaders = getNodesInnerText(document.querySelectorAll('h4')).join(" ");
                    lists.bodyText = getNodesInnerText(document.querySelectorAll('p')).join(" ");

                    return lists;
                });

                var entry = [];
                entry.push(links);
                console.log(links);

                try {
                    await index.clearObjects()
                    await index.saveObjects(entry, {
                        autoGenerateObjectIDIfNotExist: true,
                    })
                } catch (error) {
                    console.log(error)
                }
            }/* else if( buttonName == "Events" ){
                button.click();
                await page.waitForNavigation();
                let links = await page.evaluate(()=>{
                    const lists = {};

                    const headSource = document.querySelector('head');
                    lists.url = headSource.querySelector('meta[property="og:url"]').getAttribute('content');
                    lists.featureImage = headSource.querySelector('meta[property="og:image"]').getAttribute('content');
                    lists.meta = headSource.querySelector('meta[property="og:description"]').getAttribute('content');

                    const getNodesInnerText = (nodes)  => {
                        return Array.from(nodes).map(node => node.innerText);
                    }
                    
                    lists.title = document.querySelector('h1').innerText;
                    lists.headers = getNodesInnerText(document.querySelectorAll('h2'));
                    lists.subHeaders = getNodesInnerText(document.querySelectorAll('h3'));
                    lists.smallerHeaders = getNodesInnerText(document.querySelectorAll('h4'));
                    lists.bodyText = getNodesInnerText(document.querySelectorAll('p'));

                    return lists;
                });

                var entry = [];
                entry.push(links);
                console.log(links);

                try {
                    await index.saveObjects(entry, {
                        autoGenerateObjectIDIfNotExist: true,
                    })
                } catch (error) {
                    console.log(error)
                }          
            
                const internalItems = await page.$$('.title');

                for (let s = 0; s < internalItems.length; s++) {
                    const internalItems = await page.$$('.title');

                    const block = internalItems[s];
                    await block.$('a')
                    if ('a[href*="iot-world"]'){
                        const subButton = await block.$('a[href*="iot-world"]');
                        subButton.click();
                        await page.waitForNavigation();
                        let links = await page.evaluate(()=>{
                            const lists = {};

                            const headSource = document.querySelector('head');
                            lists.url = headSource.querySelector('meta[property="og:url"]').getAttribute('content');
                            lists.featureImage = headSource.querySelector('meta[property="og:image"]').getAttribute('content');
                            lists.meta = headSource.querySelector('meta[property="og:description"]').getAttribute('content');

                            const getNodesInnerText = (nodes)  => {
                                return Array.from(nodes).map(node => node.innerText);
                            }
                            
                            lists.title = document.querySelector('h1').innerText;
                            lists.headers = getNodesInnerText(document.querySelectorAll('h2'));
                            lists.subHeaders = getNodesInnerText(document.querySelectorAll('h3'));
                            lists.smallerHeaders = getNodesInnerText(document.querySelectorAll('h4'));
                            lists.bodyText = getNodesInnerText(document.querySelectorAll('p'));

                            return lists;
                        });

                        var entry = [];
                        entry.push(links);
                        console.log(links);

                        try {
                            await index.saveObjects(entry, {
                                autoGenerateObjectIDIfNotExist: true,
                            })
                        } catch (error) {
                            console.log(error)
                        }   
                    }else{}

                    await page.goBack()
                }
            } */else if( buttonName == "Case Studies" ){
                button.click();
                await page.waitForNavigation();
                let links = await page.evaluate(()=>{
                    const lists = {};

                    const headSource = document.querySelector('head');
                    lists.url = headSource.querySelector('meta[property="og:url"]').getAttribute('content');
                    lists.featureImage = headSource.querySelector('meta[property="og:image"]').getAttribute('content');
                    lists.meta = headSource.querySelector('meta[property="og:description"]').getAttribute('content');

                    const getNodesInnerText = (nodes)  => {
                        return Array.from(nodes).map(node => node.innerText);
                    }
                    
                    lists.title = document.querySelector('h1').innerText;
                    lists.headers = getNodesInnerText(document.querySelectorAll('h2')).join(" ");
                    lists.subHeaders = getNodesInnerText(document.querySelectorAll('h3')).join(" ");
                    lists.smallerHeaders = getNodesInnerText(document.querySelectorAll('h4')).join(" ");
                    lists.bodyText = getNodesInnerText(document.querySelectorAll('p')).join(" ");

                    return lists;
                });

                var entry = [];
                entry.push(links);
                console.log(links);

                try {
                    await index.saveObjects(entry, {
                        autoGenerateObjectIDIfNotExist: true,
                    })
                } catch (error) {
                    console.log(error)
                }          
            
                const internalItems = await page.$$('.block-container');

                for (let s = 0; s < internalItems.length; s++) {
                    const internalItems = await page.$$('.block-container');

                    const block = internalItems[s];
                    const subButton = await block.$('a[href*="client-case-studies"]');
                    if (subButton){
                        subButton.click();
                        await page.waitForNavigation();
                        let links = await page.evaluate(()=>{
                            const lists = {};

                            const headSource = document.querySelector('head');
                            lists.url = headSource.querySelector('meta[property="og:url"]').getAttribute('content');
                            lists.featureImage = headSource.querySelector('meta[property="og:image"]').getAttribute('content');
                            lists.meta = headSource.querySelector('meta[property="og:description"]').getAttribute('content');

                            const getNodesInnerText = (nodes)  => {
                                return Array.from(nodes).map(node => node.innerText);
                            }
                            
                            lists.title = document.querySelector('h1').innerText;
                            lists.headers = getNodesInnerText(document.querySelectorAll('h2')).join(" ");
                            lists.subHeaders = getNodesInnerText(document.querySelectorAll('h3')).join(" ");
                            lists.smallerHeaders = getNodesInnerText(document.querySelectorAll('h4')).join(" ");
                            lists.bodyText = getNodesInnerText(document.querySelectorAll('p')).join(" ");

                            return lists;
                        });

                        var entry = [];
                        entry.push(links);
                        console.log(links);

                        try {
                            await index.saveObjects(entry, {
                                autoGenerateObjectIDIfNotExist: true,
                            })
                        } catch (error) {
                            console.log(error)
                        }   
                    }else{}

                    await page.goBack()
                }
            } else{
                button.click();
                await page.waitForNavigation();
                let links = await page.evaluate(()=>{
                    const lists = {};

                    const headSource = document.querySelector('head');
                    lists.url = headSource.querySelector('meta[property="og:url"]').getAttribute('content');
                    lists.featureImage = headSource.querySelector('meta[property="og:image"]').getAttribute('content');
                    lists.meta = headSource.querySelector('meta[property="og:description"]').getAttribute('content');

                    const getNodesInnerText = (nodes)  => {
                        return Array.from(nodes).map(node => node.innerText);
                    }
                    
                    lists.title = document.querySelector('h1').innerText;
                    lists.headers = getNodesInnerText(document.querySelectorAll('h2')).join(" ");
                    lists.subHeaders = getNodesInnerText(document.querySelectorAll('h3')).join(" ");
                    lists.smallerHeaders = getNodesInnerText(document.querySelectorAll('h4')).join(" ");
                    lists.bodyText = getNodesInnerText(document.querySelectorAll('p')).join(" ");

                    return lists;
                });

                var entry = [];
                entry.push(links);
                console.log(links);

                 try {
                    await index.saveObjects(entry, {
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

