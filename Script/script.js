
    // 1. Selct counter element

    const totalCountEl = document.querySelectorAll('.stat-card .value')[0];
    const interviewCountEl = document.querySelectorAll('.stat-card .value')[1];
    const rejectedCountEl = document.querySelectorAll('.stat-card .value')[2];
    const noJobsSection = document.getElementById('no-jobs-section');
    const jobsCountText = document.querySelector('.Available p'); // "8 jobs" text

    // Setting a variable with the current card number at the beginning
    let totalCount = document.querySelectorAll('.job-card').length;
    let interviewCount = 0;
    let rejectedCount = 0;

    // 2. Main update function (to refresh everything)
    function updateDashboard() {
        // Numbers displayed on screen
        totalCountEl.innerText = totalCount;
        interviewCountEl.innerText = interviewCount;
        rejectedCountEl.innerText = rejectedCount;
        if(jobsCountText) jobsCountText.innerText = `${totalCount} jobs`;

        // See which filters are currently active.
        const activeFilter = document.querySelector('btn-list button.bg-blue-500')?.innerText.toLowerCase() || 'all';
        
        let visibleCards = 0;
        const allCards = document.querySelectorAll('.job-card');

        allCards.forEach(card => {
            const status = card.dataset.status || 'not-applied';
            let isVisible = false;

            if (activeFilter === 'all') isVisible = true;
            else if (activeFilter === 'interview' && status === 'interview') isVisible = true;
            else if (activeFilter === 'rejected' && status === 'rejected') isVisible = true;

            card.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCards++;
        });

        //If there is no card, show 'No Jobs' message 
        noJobsSection.hidden = (visibleCards > 0);
    }

    // 3. The logic behind each card (Click Events)
    document.querySelectorAll('.job-card').forEach(card => {
        const notAppliedLabel = card.querySelector('div:nth-of-type(1) button:nth-of-type(1)');
        const interviewLabel = card.querySelector('div:nth-of-type(1) button:nth-of-type(2)');
        const rejectedLabel = card.querySelector('div:nth-of-type(1) button:nth-of-type(3)');
        
        const btnInterview = card.querySelector('div.flex.gap-4 button:nth-of-type(1)');
        const btnRejected = card.querySelector('div.flex.gap-4 button:nth-of-type(2)');
        const btnDelete = card.querySelector('.fa-trash-can').parentElement; // delete button

        // Interview button click
        btnInterview.onclick = () => {
            if (card.dataset.status === 'interview') return;
            if (card.dataset.status === 'rejected') rejectedCount--;
            
            card.dataset.status = 'interview';
            interviewCount++;
            
            showOnlyStatusLabel(card, 'interview');
            updateDashboard();
        };

        // Reject button click
        btnRejected.onclick = () => {
            if (card.dataset.status === 'rejected') return;
            if (card.dataset.status === 'interview') interviewCount--;

            card.dataset.status = 'rejected';
            rejectedCount++;

            showOnlyStatusLabel(card, 'rejected');
            updateDashboard();
        };

        // Delete button click
        btnDelete.onclick = () => {
            // What was the status of the check before deletion?
            if (card.dataset.status === 'interview') interviewCount--;
            if (card.dataset.status === 'rejected') rejectedCount--;
            
            totalCount--; // Total reduced by 1
            card.remove(); // Delete the card
            updateDashboard();
        };
    });

    // Small function to swap labels
    function showOnlyStatusLabel(card, status) {
        const labels = card.querySelectorAll('div:nth-of-type(1) button');
        labels[0].classList.add('hidden'); // Not Applied hide
        labels[1].classList.toggle('hidden', status !== 'interview');
        labels[2].classList.toggle('hidden', status !== 'rejected');
    }

    // 4. filter button controll
    const filterButtons = document.querySelectorAll('btn-list button');
    filterButtons.forEach(btn => {
        btn.onclick = () => {
            filterButtons.forEach(b => b.classList.remove('bg-blue-500', 'text-white', 'font-bold'));
            btn.classList.add('bg-blue-500', 'text-white', 'font-bold');
            updateDashboard();
        };
    });

    // Updating the dashboard once at the beginning
    updateDashboard();