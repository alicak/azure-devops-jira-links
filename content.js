addLocationObserver(JiraIssueLinks)
JiraIssueLinks()

function JiraIssueLinks() {
    // TODO: replace with your organisation name
    const azureDevopsUrlPattern = 'https:\/\/dev\.azure\.com\/organisationName\/[^\/]*\/_git\/[^\/]*\/';
    const queryParamsPattern = '([\?].*)?(#.*)?';
    const createAzureUrlPattern = urlKey => new RegExp(`${azureDevopsUrlPattern}${urlKey}${queryParamsPattern}`);

    const pullRequestPageRegex = createAzureUrlPattern('pullrequest\/[0-9]+');
    const commitListPageRegex = createAzureUrlPattern('commits');
    const commitPageRegex = createAzureUrlPattern('commit\/.+');
    const pushesPageRexeg = createAzureUrlPattern('pushes');
    
    const currentUrl = window.location.href;

    // TODO: replace with your issue code
    const issueIdRegex = /ABC-[0-9]{1,6}/g;
    // TODO: replace with your organisation name
    const jiraUrl = 'https://organisationName.atlassian.net'

    const createIssueLinkElement = issueId => `<a href="${jiraUrl}/browse/${issueId}">${issueId}</a>`;
    const issueLinkElementExists = parent => parent.innerHTML.includes(jiraUrl);

    if (pullRequestPageRegex.test(currentUrl)) {
        const titleParentElement = document.querySelector('.repos-pr-title');
        const titleElement = titleParentElement.childNodes[0];

        const matches = titleElement.value.match(issueIdRegex);
        
        if (matches == null || issueLinkElementExists(titleParentElement.parentElement))
            return;

        const issueId = matches[0];
        titleParentElement.insertAdjacentHTML('afterend', `<div>Link to Jira issue: ${createIssueLinkElement(issueId)}</div>`);

        return;
    }

    if (commitPageRegex.test(currentUrl)) {
        const titleElement = document.querySelector('.repos-commit-title-row');

        const matches = titleElement.textContent.match(issueIdRegex);
        if (matches == null || issueLinkElementExists(titleElement))
            return;

        const issueId = matches[0];
        titleElement.innerHTML = titleElement.innerHTML.replace(issueId, createIssueLinkElement(issueId));

        return;
    }

    if (commitListPageRegex.test(currentUrl)) {
        const commitTitles = document.querySelectorAll('.commit-title');

        commitTitles.forEach(commitTitle => {
            const matches = commitTitle.textContent.match(issueIdRegex);

            if (matches == null || issueLinkElementExists(commitTitle))
                return;

            const issueId = matches[0];
            commitTitle.innerHTML = commitTitle.innerHTML.replace(issueId, createIssueLinkElement(issueId));
        });

        return;
    }

    if (pushesPageRexeg.test(currentUrl)) {
        const pushesElements = document.querySelectorAll('.repos-pushes-table .bolt-table-two-line-cell .bolt-table-cell-content');

        pushesElements.forEach(push => {
            const matches = push.childNodes[0].textContent.match(issueIdRegex);

            if (matches == null || issueLinkElementExists(push))
                return;

            const issueId = matches[0];
            push.insertAdjacentHTML('beforeend', `<div>Link to Jira issue: ${createIssueLinkElement(issueId)}</div>`)
        });

        return;
    }
}

function addLocationObserver(callback) {
    const config = { attributes: false, childList: true, subtree: false }
    const observer = new MutationObserver(callback)
    observer.observe(document.body, config)
}